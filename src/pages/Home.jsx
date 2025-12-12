import { useEffect, useState } from 'react';
import { gotoSpotifyAuth, requestToken } from '../services/apiSpotify';
import { useCodeChallenge } from '../hooks/useCodeChallenge';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_CODE_STORAGE_KEY,
  REDIRECT_URI,
} from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import Spinner from '../ui/Spinner';
import Header from '../ui/Header';

//This is now the auth component as I have created the Landing page as the home page once it was all working
function Home() {
  console.log('Home component rendered');
  //code is the ref.current - if no value then we have not gone to spotify for an auth code, if it has a value then it is the code that has been returned
  const { code, error } = useCodeChallenge();
  const [fatality, setFatality] = useState(null);
  const navigate = useNavigate();

  //trying to get the spinner to show before this executes which is why I tried LayoutEffect in place of standard useEffect - it didn't work :(
  useEffect(() => {
    //For error handling and awaiting my async api functions I'll set up some inner async functions that can be called from in here
    //gotoSpotifyAuth can throw an error so we'll want to catch that
    // async function tryGotoSpotifyAuth() {
    //   try {
    //     gotoSpotifyAuth();
    //   } catch (error) {
    //     console.error(
    //       'Error thrown by gotoSpotifyAuth whilst being called from Home:',
    //       error
    //     );
    //   }
    // }
    //if we have already got the code then this function 'swaps' it for the actual access token - used in two places hence extracting it to it's own function
    async function getTokenWithCode(code) {
      try {
        await requestToken(code);
        console.log(`Token successfully requested`);
        //This should probably be done in requestToken?
        // window.localStorage.removeItem(AUTH_CODE_STORAGE_KEY);
        navigate('/playlists', { replace: true });
      } catch (error) {
        setFatality(
          `Error requesting token within getTokenWithCode. Error: ${error}`
        );
        window.localStorage.removeItem(AUTH_CODE_STORAGE_KEY);
      }
    }

    async function handleAuthFlow() {
      //we have come back to home although we already have an access token so just navigate to playlists
      if (window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) && !error) {
        console.log(`Access token already exists - navigating to playlists`);
        navigate('/playlists', { replace: true });
        return;
      }
      //we have gone to the spotify auth and got our code which we can 'swap' for a token
      const authCodeFromStorage = window.localStorage.getItem(
        AUTH_CODE_STORAGE_KEY
      );

      if (
        authCodeFromStorage &&
        !window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
      ) {
        await getTokenWithCode(authCodeFromStorage);
        return;
      }
      if (code && !window.localStorage.getItem(AUTH_CODE_STORAGE_KEY)) {
        console.log(
          `Code found in Home, setting AUTH_CODE_STORAGE_KEY to: ${code}`
        );
        window.localStorage.setItem(AUTH_CODE_STORAGE_KEY, code);
        // window.location.reload(); - no this is not the correct way, we'll just try to get the token immediately
        // remove ?code=... from the url without reload
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        // clear the code from history and logs so it's a bit more secure
        window.history.replaceState(
          {},
          document.title,
          url.pathname + url.search
        );

        // immediately start exchangeing code for token
        await getTokenWithCode(code);
        return;
      }

      //we have not gone to spotify for an auth code yet so we cannot get our token yet
      else if (!code && !error) {
        console.log(
          `No code found in Home so calling gotoSpotifyAuth() to redirect user to Spotify login/auth page`
        );
        //gotoSpotifyAuth can throw an error so we'll want to catch that
        try {
          gotoSpotifyAuth();
        } catch (error) {
          setFatality(
            'Error thrown by gotoSpotifyAuth whilst being called from Home:',
            error
          );
        }
      }
    }
    handleAuthFlow();
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

  if (fatality) {
    return (
      <main className="app-layout">
        <Header />
        <div className="error-content">
          <h1>
            We're very sorry but something has gone wrong whilst trying to log
            into Spotify. This could be due to network problems or a server
            error
          </h1>
          <h2>We received an error message: {fatality}</h2>
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
