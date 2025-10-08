import {
  REDIRECT_URI,
  AUTH_ENDPOINT,
  SCOPE,
  CODE_VERIFIER_STORAGE_KEY,
  ACCESS_TOKEN_STORAGE_KEY,
} from '../utils/constants.js';

//...decided to centralise these constants
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

//We now have to use PCKE authorizion flow as the token method was deprecated in 2025
//first generate a random string with this code from Spotify docs https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
const generateRandomString = (length) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

//Next it needs to be hashed using SHA256 and then base64 encoded
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await window.crypto.subtle.digest('SHA-256', data);
}

//base64 encode the hash
function base64encode(input) {
  //   return (
  //     btoa(String.fromCharCode(...new Uint8Array(input)))
  // .replace(/\+/g, '-')
  // .replace(/\//g, '_')
  // .replace(/=/g, '')
  //   );
  //let's try the auth0 method for this perhaps
  return input
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
const codeVerifier = generateRandomString(64);
// const codeVerifier = base64encode(generateRandomString(64));

//finally we can generate the code challenge
const hashed = await sha256(codeVerifier);
const codeChallenge = base64encode(hashed);

//Now we'll pop our code challenge in local storage to compare later
window.localStorage.setItem(CODE_VERIFIER_STORAGE_KEY, codeVerifier);

//next we build our request string
const params = {
  client_id: CLIENT_ID,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  scope: SCOPE,
  code_challenge_method: 'S256',
  code_challenge: codeChallenge,
};

export function gotoAuth() {
  AUTH_ENDPOINT.search = new URLSearchParams(params).toString();
  window.location.href = AUTH_ENDPOINT.toString();
}

export async function requestToken(code) {
  console.log(`Requesting token with code: ${code}`);
  //once we've got a code from the gotoAuth redirect we can exchange it for a token
  //   const codeVerifier = window.localStorage.getItem(CODE_VERIFIER_STORAGE_KEY);
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
  console.log(`Token request payload: ${payload.body.toString()}`);
  const result = await fetch(url, payload);
  //   if (!result.ok) {
  //     throw new Error(`HTTP error! status: ${result.status}`);
  //   }
  const response = await result.json();
  if (!response.ok) {
    throw new Error(
      `Token request error: ${response.error} - ${response.error_description}`
    );
  }

  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, response.access_token);
  //   return response.access_token;
}
//old deprecated method -
// function gotoAuth() {
//   window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
// }

// export { gotoAuth };
