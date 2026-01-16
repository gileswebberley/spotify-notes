export const HOST = '127.0.0.1';
export const PORT = 4173;
export const REDIRECT_URI = `http://${HOST}:${PORT}/auth`; //for testing'https://s-notify.netlify.app/auth';//for deployment
export const AUTH_ENDPOINT = new URL('https://accounts.spotify.com/authorize');
export const SCOPE =
  'user-read-private user-read-email playlist-read-private playlist-read-collaborative'; // user-read-private user-read-email';
export const CODE_VERIFIER_STORAGE_KEY = 'code-verifier';
export const CODE_CHALLENGE_STORAGE_KEY = 'code-challenge';
export const ACCESS_TOKEN_STORAGE_KEY = 'access-token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh-token';
export const AUTH_CODE_STORAGE_KEY = 'auth_code';
export const EXPIRATION_TIME_STORAGE_KEY = 'token-expiration-time';
export const AUTH_PATH = '/auth';
export const MAX_NOTE_CHARS = 255 * 4;
