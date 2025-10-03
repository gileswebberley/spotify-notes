const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID; //'ecbe55ef331142259862b25a9f54a3ea';
const REDIRECT_URI = 'http://127.0.0.1:5173/';
const AUTH_ENDPOINT = new URL('https://accounts.spotify.com/authorize');
const SCOPE =
  'playlist-read-private playlist-read-collaborative user-read-private user-read-email';
// const RESPONSE_TYPE = 'code';

//We now have to use PCKE authorizion flow as the token method was deprecated in 2025
//first generate a random string with this code from Spotify docs https://developer.spotify.com/documentation/web-api/tutorials/code-pkce-flow
const generateRandomString = (length) => {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const codeVerifier = generateRandomString(64);

//Next it needs to be hashed using SHA256 and base64 encoded
async function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
}

//base64 encode the hash
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

//finally we can generate the code challenge
const hashed = await sha256(codeVerifier);
const codeChallenge = base64encode(hashed);

//Now we'll pop our code challenge in local storage to compare later
window.localStorage.setItem('code_verifier', codeVerifier);

//next we build our request string
const params = {
  response_type: 'code',
  client_id: CLIENT_ID,
  scope: SCOPE,
  code_challenge_method: 'S256',
  code_challenge: codeChallenge,
  redirect_uri: REDIRECT_URI,
};

function gotoAuth() {
  AUTH_ENDPOINT.search = new URLSearchParams(params).toString();
  window.location.href = AUTH_ENDPOINT.toString();
}

//old deprecated method -
// function gotoAuth() {
//   window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
// }

export { gotoAuth };
