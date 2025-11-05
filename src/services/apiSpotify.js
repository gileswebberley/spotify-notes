//...decided to centralise these constants
import {
  REDIRECT_URI,
  AUTH_ENDPOINT,
  SCOPE,
  CODE_VERIFIER_STORAGE_KEY,
  ACCESS_TOKEN_STORAGE_KEY,
  CODE_CHALLENGE_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
  EXPIRATION_TIME_STORAGE_KEY,
} from '../utils/constants.js';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

//We now have to use PCKE authorizion flow as the token method was deprecated in 2025
//first generate a random string as the code-verifier with this code from Spotify docs https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
const generateRandomString = (length) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

//Next we need to create the code-challenge, it needs to be hashed using SHA256 and then base64 encoded
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await window.crypto.subtle.digest('SHA-256', data);
  //   return hashed;
}

//base64 encode the hash
function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

//These were all defined in the main thread and so were being recreated between sending the code challenge and requesting the token with the verifier - moving them here and calling within the gotoAuth function seems to have solved the problem
async function createCodeChallengeWithVerifier() {
  const codeVerifier = generateRandomString(64);
  //using await avoids the codeChallenge being saved as [object Promise] which is what I had been sending to Spotify!!
  const codeChallenge = await sha256(codeVerifier)
    .then((hashed) => {
      console.log(`Code challenge is: ${base64encode(hashed)}`);
      return base64encode(hashed);
    })
    .catch((e) => {
      console.error(`Error generating code challenge: ${e}`);
    });

  //Now we'll pop our code challenge in local storage to compare later
  window.localStorage.setItem(CODE_VERIFIER_STORAGE_KEY, codeVerifier);
  window.localStorage.setItem(CODE_CHALLENGE_STORAGE_KEY, codeChallenge);
}

//This creates the code challenge and verifier then redirects to Spotify for authorisation code which we can use to request an access token
export async function gotoSpotifyAuth() {
  await createCodeChallengeWithVerifier();
  const codeChallenge = window.localStorage.getItem(CODE_CHALLENGE_STORAGE_KEY);
  console.log(`Code challenge from storage is: ${codeChallenge}`);
  //next we build our request string
  const params = {
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPE,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  };
  //as the AUTH_ENDPOINT is a URL object we can set the search params directly
  AUTH_ENDPOINT.search = new URLSearchParams(params).toString();
  //then redirect to the modified AUTH_ENDPOINT (namely with the params added to the URL object)
  window.location.href = AUTH_ENDPOINT.toString();
}

//Once we've got the code from spotify we use this to 'swap' it for an access token
export async function requestToken(code) {
  //   console.log(`Requesting token with code: ${code}`);
  //this should have been stored during execution of gotoSpotifyAuth along with the code that has been passed in here
  const codeVerifier = window.localStorage.getItem(CODE_VERIFIER_STORAGE_KEY);
  const url = 'https://accounts.spotify.com/api/token';
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  };

  const response = await fetchPayloadResponse(url, payload);

  setAccessTokenStorage(response);

  //clear up the now defunct code based keys (they expire after 10 minutes anyway)
  window.localStorage.removeItem(CODE_VERIFIER_STORAGE_KEY);
  window.localStorage.removeItem(CODE_CHALLENGE_STORAGE_KEY);
  return response.access_token;
}

//because I'm copying and pasting some stuff I'll extract it into functions
async function fetchPayloadResponse(url, payload) {
  const result = await fetch(url, payload);
  if (!result.ok) {
    console.log(
      `Fetching error from fetchPayloadResponse call - status: ${result.status}`
    );
    throw new Error(
      `Fetching error from fetchPayloadResponse: ${result?.message}`
    );
  }
  const response = await result.json();
  if (response.error) {
    throw new Error(
      `Response error from fetchPayloadResponse: ${response.error} - ${response.error_description}`
    );
  }
  // console.log(`fetchPayloadResponse response: ${JSON.stringify(response)}`);
  return response;
}

function setAccessTokenStorage(response) {
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.access_token);
  window.localStorage.setItem(
    REFRESH_TOKEN_STORAGE_KEY,
    response.refresh_token
  );
  //to deal with the access token expiring we'll store the expiration time and then we can compare against it within the useAccessToken function
  const expirationTime = new Date().getTime() + response.expires_in * 1000; //expires_in is in seconds!
  window.localStorage.setItem(EXPIRATION_TIME_STORAGE_KEY, expirationTime);
}

async function refreshAccessToken() {
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  const url = 'https://accounts.spotify.com/api/token';
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    }),
  };
  const response = await fetchPayloadResponse(url, payload).catch((e) => {
    console.error(`Error refreshing access token: ${e}`);
    gotoSpotifyAuth(); //if we can't refresh the token then we need to re-authenticate
  });
  setAccessTokenStorage(response);
}

//I need to work out how to deal with the access token expiring and refresh it - apparently you receive a 401 error when expired at which point we'll want to use the refresh token to get a new one. Instead of doing that I'm going to save the UTC expiiration time and simply compare that against now in milliseconds
export async function getAccessToken() {
  const now = Number(new Date().getTime());
  const safe = 5000 * 60 + now; //5 minutes safety margin
  const expire = Number(
    window.localStorage.getItem(EXPIRATION_TIME_STORAGE_KEY)
  );
  console.log(
    `Now is ${safe} and token expires at ${expire} so safe > expire is ${
      safe > expire
    } by ${(expire - safe) / 60000} minutes`
  );
  //check whether there's at least 5 minutes left on the token
  if (expire - safe <= 0) {
    //token is expired or about to expire so we need to get a new one
    console.log(`Access token expired or about to expire - refreshing`);
    await refreshAccessToken();
  }
  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  return accessToken;
}

export async function getUserProfile() {
  const accessToken = await getAccessToken();
  const url = 'https://api.spotify.com/v1/me';
  const payload = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const result = await fetchPayloadResponse(url, payload);
  console.log(`User profile response:`);
  console.table(result);
  return result;
}

export async function getUserPlaylists() {
  const accessToken = await getAccessToken();
  // const userId = await getUserProfile().then((profile) => profile.id);
  const url = `https://api.spotify.com/v1/me/playlists?limit=50`;
  // console.log(`Fetching playlists for user: ${userId}`);
  const payload = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const result = await fetchPayloadResponse(url, payload);
  console.log(`User playlists response:`);
  console.table(result.items);
  return result;
}
