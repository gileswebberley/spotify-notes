import { useEffect } from 'react';
// import { useToken } from '../hooks/useToken';
import { gotoSpotifyAuth, requestToken } from '../services/apiSpotify';
import { useCodeChallenge } from '../hooks/useCodeChallenge';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_CODE_STORAGE_KEY,
  REDIRECT_URI,
} from '../utils/constants';
import { useNavigate } from 'react-router-dom';

function Home() {
  console.log('Home component rendered');
  //code is the ref.current - if no value then we have not gone to spotify for an auth code, if it has a value then it is the code that has been returned
  const { code, error } = useCodeChallenge();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('RUNNING EFFECT IN HOME....');
    //if we have already got the code then this function 'swaps' it for the actual access token
    async function getTokenWithCode(code) {
      console.log(
        'getTokenWithCode has been called so about to run requestToken...'
      );
      await requestToken(code)
        .then(() => {
          console.log(`Token successfully requested`);
          window.localStorage.removeItem(AUTH_CODE_STORAGE_KEY);
          navigate('/playlists', { replace: true });
        })
        .catch((e) => {
          console.error(
            `Error requesting token within getTokenWithCode. Error: ${e}`
          );
          //try again if it failed? It seems to fail when network is throttled :/
          // navigate('/', { replace: true });
        });
      console.log('End of getTokenWithCode after then().catch() block');
    } //we have come back to home although we already have an access token so just navigate to playlists
    if (window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) && !error) {
      console.log(`Access token already exists - navigating to playlists`);
      navigate('/playlists', { replace: true });
    }
    //we have gone to the spotify auth and got our code which we can 'swap' for a token
    else if (
      window.localStorage.getItem(AUTH_CODE_STORAGE_KEY) &&
      !window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    ) {
      console.log(
        `Have auth code now requesting access token with call to getTokenWithCode(${window.localStorage.getItem(
          AUTH_CODE_STORAGE_KEY
        )})`
      );
      getTokenWithCode(window.localStorage.getItem(AUTH_CODE_STORAGE_KEY));
      //   getTokenWithCode();
    }
    //we have not gone to spotify for an auth code yet so we cannot get our token yet
    else if (!code && !error) {
      console.log(
        `No code found in Home so calling gotoSpotifyAuth() to redirect user to Spotify login/auth page`
      );
      gotoSpotifyAuth();
    }
    //we have gone to spotify and got a code back so we store it in local storage and 'reload' the app to clear the url params
    else if (code && !window.localStorage.getItem(AUTH_CODE_STORAGE_KEY)) {
      console.log(
        `Code found in Home, setting AUTH_CODE_STORAGE_KEY to: ${code}`
      );
      window.localStorage.setItem(AUTH_CODE_STORAGE_KEY, code);
      //navigate('/', { replace: true });
      console.log(
        `code has been set to ${window.localStorage.getItem(
          AUTH_CODE_STORAGE_KEY
        )}`
      );
      console.log('Now reloading page with window.location.href....');
      window.location.href = REDIRECT_URI;
    }
  }, [code, error, navigate]);

  if (error) {
    return (
      <>
        <h1>Please accept the usage of Spotify to use this app</h1>
        <p>Error details: {error}</p>
        <button onClick={() => navigate('/')}>Try Again</button>
      </>
    );
  }

  return <h1>We're just getting your Spotify authentication dealt with...</h1>;
}

export default Home;
