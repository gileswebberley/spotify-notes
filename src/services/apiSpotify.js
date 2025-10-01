const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID; //'ecbe55ef331142259862b25a9f54a3ea';
const REDIRECT_URI = 'http://127.0.0.1:5173/';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

function gotoAuth() {
  window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
}

export { gotoAuth };
