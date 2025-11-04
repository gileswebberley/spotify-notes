//...decided to centralise these constants
import {
  REDIRECT_URI,
  AUTH_ENDPOINT,
  SCOPE,
  CODE_VERIFIER_STORAGE_KEY,
  ACCESS_TOKEN_STORAGE_KEY,
  CODE_CHALLENGE_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
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

export async function gotoAuth() {
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
  AUTH_ENDPOINT.search = new URLSearchParams(params).toString();
  window.location.href = AUTH_ENDPOINT.toString();
}

export async function requestToken(code) {
  console.log(`Requesting token with code: ${code}`);
  //once we've got a code from the gotoAuth redirect we can exchange it for a token
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
  //   console.log(`Token request payload: ${payload.body.toString()}`);
  const result = await fetch(url, payload);
  if (!result.ok) {
    console.log(`Token request result status: ${result.status}`);
    throw new Error(`error fetching token: ${result?.message}`);
  }
  const response = await result.json();
  if (response.error) {
    throw new Error(
      `Token request error: ${response.error} - ${response.error_description}`
    );
  }
  console.log(`Token response: ${JSON.stringify(response)}`);
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.access_token);
  window.localStorage.setItem(
    REFRESH_TOKEN_STORAGE_KEY,
    response.refresh_token
  );
  window.localStorage.removeItem(CODE_VERIFIER_STORAGE_KEY);
  window.localStorage.removeItem(CODE_CHALLENGE_STORAGE_KEY);
  return response.access_token;
}
