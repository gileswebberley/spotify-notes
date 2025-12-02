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

//using .env.local and this is how you access those variables within Vite
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

//We now have to use PCKE authorizion flow as the token method was deprecated in 2025
//first generate a random string as the code-verifier with this code from Spotify docs https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
const generateRandomString = (length) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //now fill a typed array with 'length' amount of secure random values
  const values = crypto.getRandomValues(new Uint8Array(length));
  //then map those values to characters from the possible string
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

//Next we need to create the code-challenge, it needs to be hashed using SHA256 and then base64 encoded
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await window.crypto.subtle.digest('SHA-256', data);
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
  //returns a promise so we need to wait for it to resolve...
  await createCodeChallengeWithVerifier();
  const codeChallenge = window.localStorage.getItem(CODE_CHALLENGE_STORAGE_KEY);
  // console.log(`Code challenge from storage is: ${codeChallenge}`);
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
  // console.log(`Requesting token with code: ${code}`);
  //this should have been stored during execution of gotoSpotifyAuth along with the code that has been passed in here
  const codeVerifier = window.localStorage.getItem(CODE_VERIFIER_STORAGE_KEY);
  // console.log(`Code verifier from storage: ${codeVerifier}`);
  const url = 'https://accounts.spotify.com/api/token';
  //whilst developing this it was all working until I enabled network throttling at which point it failed. After a day of searching and trying to troubleshoot with a bit of AI assistance I discovered that the serialisation proccess involved in using URLSearchParams was taking a moment longer somehow (which I don't fully understand tbh). By creating the serailised body first and then passing that in as the body it seems to work fine even with throttling enabled - This is an important lesson which I had no idea about until this point.
  const body = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  }).toString();
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  };
  const response = await fetchPayloadResponse(url, payload);

  setAccessTokenStorage(response);

  // //clear up the now defunct code based keys (they expire after 10 minutes anyway)
  window.localStorage.removeItem(CODE_VERIFIER_STORAGE_KEY);
  window.localStorage.removeItem(CODE_CHALLENGE_STORAGE_KEY);
  return response.access_token;
}

//because I'm copying and pasting some stuff I'll extract it into functions
//first a function to handle fetch requests with a payload and deal with errors
async function fetchPayloadResponse(url, payload) {
  // console.log(`fetchPayloadResponse called with url: ${url}`);
  // console.table('And payload:', payload);
  const result = await fetch(url, payload);
  if (!result.ok) {
    console.table(
      `Fetching error from fetchPayloadResponse call - status: `,
      JSON.stringify(result)
    );
    throw new Error(
      `Fetching error from fetchPayloadResponse: ${JSON.stringify(result)}`
    );
  }
  const response = await result.json();
  if (response.error) {
    throw new Error(
      `Response error from fetchPayloadResponse: ${response.error} - ${response.error_description}`
    );
  }
  return response;
}

//this is used when the access token is returned from spotify and adds the expiration time to local storage so it can be tested against when consuming the token and refresh if it's getting close to expiring
function setAccessTokenStorage(response) {
  console.table(
    `setAccessTokenStorage has been called with response - `,
    response
  );
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
  console.log(`refreshAccessToken has been called...`);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  const url = 'https://accounts.spotify.com/api/token';
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: CLIENT_ID,
  }).toString();
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body,
  };
  //just using a little catch() here rather than try-catch as it's a bit neater for this small block
  const response = await fetchPayloadResponse(url, payload).catch((e) => {
    console.error(`Error refreshing access token: ${e}`);
    gotoSpotifyAuth(); //if we can't refresh the token then we need to re-authenticate from the beginning, namely do the whole code challenge and acceptance of spotify scopes again
  });
  setAccessTokenStorage(response);
}

//I need to work out how to deal with the access token expiring and refresh it - apparently you receive a 401 error when expired at which point we'll want to use the refresh token to get a new one. Instead of doing that I'm going to save the UTC expiiration time and simply compare that against 'now' in milliseconds
//rather than grab the access token whenever it's needed I'm going to use this function which will check the expiration time and refresh if needed before returning the token
export async function getAccessToken() {
  const now = Number(new Date().getTime());
  const safe = 5000 * 60 + now; //5 minutes safety margin
  const expire = Number(
    window.localStorage.getItem(EXPIRATION_TIME_STORAGE_KEY)
  );
  //I've just made a user context which requests the user profile before we're logged in so we'll check whether the expiration time has been set as a way to know if we are logged in or not - I'll return false if not logged in rather than throwing an error
  if (!expire) {
    console.log(`No expiration time found - user not logged in`);
    return false;
  }
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

//I want to be able to protect the playlists and playlist component so just want a little function that checks if we have logged in or are trying to go to a link
export function isLoggedIn() {
  if (!window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)) {
    return false;
  }
  return true;
}

//adding get by id for get the added-by user in tracklist
export async function getUserProfile(id = null) {
  const accessToken = await getAccessToken();
  if (!accessToken) {
    console.warn(`No access token available - cannot fetch user profile`);
    return null;
  }
  const url = !id
    ? 'https://api.spotify.com/v1/me'
    : `https://api.spotify.com/v1/users/${id}`;
  //a little reminder - GET requests do not have a body so if you see extra stuff in the documentation (like limit or offset) they need to go in the URL as query params
  const payload = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const result = await fetchPayloadResponse(url, payload);
  console.table(`User profile response:`, result);
  return result;
}

export async function getUserPlaylists(offset = 0, limit = 20) {
  //max limit is 50 as per Spotify docs
  if (limit > 50) {
    limit = 50;
  }
  const accessToken = await getAccessToken();
  //if you want to be able to get other users playlists you'd need to get their user ID first and replace the 'me' in the URL below
  // const userId = await getUserProfile().then((profile) => profile.id);
  const url = new URL(`https://api.spotify.com/v1/me/playlists`);
  // console.log(`Fetching playlists for user: ${userId}`);
  //This is the way to add query params that I mentioned in getUserProfile when using a GET request
  url.search = new URLSearchParams({ offset, limit }).toString();
  const payload = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const result = await fetchPayloadResponse(url, payload);
  // console.log(`User playlists response:`);
  // console.table(result.items);
  return result;
}

export async function getUserPlaylist(playlistId) {
  const accessToken = await getAccessToken();
  const url = new URL(`https://api.spotify.com/v1/playlists/${playlistId}`);
  const payload = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  //limit has no effect as it is locked to 100 by Spotify
  // const limit = 20; //arbitrary large number to get all tracks in one go
  // url.search = new URLSearchParams({limit}).toString();
  const result = await fetchPayloadResponse(url, payload);
  // console.table(`Playlist ${playlistId} details:`, result);
  return result;
}

//
export async function getPlaylistTracks(offset = 0, limit = 20, [playlistId]) {
  const accessToken = await getAccessToken();
  const url = new URL(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
  );
  url.search = new URLSearchParams({ offset, limit }).toString();
  const payload = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  const result = await fetchPayloadResponse(url, payload);
  // console.log(`Playlist ${playlistId} tracks response:`);
  // console.table(result.items);
  return result;
}
