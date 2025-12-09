import { useLayoutEffect } from 'react';
// import { useToken } from '../hooks/useToken';
import { gotoSpotifyAuth, requestToken } from '../services/apiSpotify';
import { useCodeChallenge } from '../hooks/useCodeChallenge';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_CODE_STORAGE_KEY,
  REDIRECT_URI,
} from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import Spinner from '../ui/Spinner';
import OverlayScrollContainer from '../ui/OverlayScrollContainer';
import Header from '../ui/Header';

function Home() {
  console.log('Home component rendered');
  //code is the ref.current - if no value then we have not gone to spotify for an auth code, if it has a value then it is the code that has been returned
  const { code, error } = useCodeChallenge();
  const navigate = useNavigate();

  //trying to get the spinner to show before this executes which is why I tried LayoutEffect in place of standard useEffect - it didn't work :(
  useLayoutEffect(() => {
    //For error handling and awaiting my async api functions I'll set up some inner async functions that can be called from in here
    //gotoSpotifyAuth can throw an error so we'll want to catch that
    async function tryGotoSpotifyAuth() {
      try {
        gotoSpotifyAuth();
      } catch (error) {
        console.error(
          'Error thrown by gotoSpotifyAuth whilst being called from Home:',
          error
        );
      }
    }
    //if we have already got the code then this function 'swaps' it for the actual access token
    async function getTokenWithCode(code) {
      await requestToken(code)
        .then(() => {
          console.log(`Token successfully requested`);
          //This should probably be done in requestToken?
          // window.localStorage.removeItem(AUTH_CODE_STORAGE_KEY);
          navigate('/playlists', { replace: true });
        })
        .catch((e) => {
          console.error(
            `Error requesting token within getTokenWithCode. Error: ${e}`
          );
        });
    }
    //we have come back to home although we already have an access token so just navigate to playlists
    if (window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) && !error) {
      console.log(`Access token already exists - navigating to playlists`);
      navigate('/playlists', { replace: true });
    }
    //we have gone to the spotify auth and got our code which we can 'swap' for a token
    else if (
      window.localStorage.getItem(AUTH_CODE_STORAGE_KEY) &&
      !window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    ) {
      const code = window.localStorage.getItem(AUTH_CODE_STORAGE_KEY);
      getTokenWithCode(code);
    }
    //we have not gone to spotify for an auth code yet so we cannot get our token yet
    else if (!code && !error) {
      console.log(
        `No code found in Home so calling gotoSpotifyAuth() to redirect user to Spotify login/auth page`
      );
      tryGotoSpotifyAuth();
    }
    //we have gone to spotify and got a code back so we store it in local storage and 'reload' the app to clear the url params
    else if (code && !window.localStorage.getItem(AUTH_CODE_STORAGE_KEY)) {
      console.log(
        `Code found in Home, setting AUTH_CODE_STORAGE_KEY to: ${code}`
      );
      window.localStorage.setItem(AUTH_CODE_STORAGE_KEY, code);
    }
  }, [code, error, navigate]);

  if (error) {
    return (
      <main className="app-layout">
        <Header />
        <div className="error-content">
          <h1>Please accept the usage of Spotify to use this app</h1>
          <h2>We received an error message from Spotify: {error}</h2>
          <button onClick={() => window.location.replace(REDIRECT_URI)}>
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return <Spinner />;
}

export default Home;
