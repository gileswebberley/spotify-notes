import { useEffect } from 'react';
// import { useToken } from '../hooks/useToken';
import { gotoAuth, requestToken } from '../services/apiSpotify';
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
    //if we have already got the code then this function 'swaps' it for the actual access token
    async function getTokenWithCode(code) {
      await requestToken(code)
        .then(() => {
          console.log(`Token successfully requested`);
          window.localStorage.removeItem(AUTH_CODE_STORAGE_KEY);
          navigate('/playlists', { replace: true });
        })
        .catch((e) => {
          console.error(`Error requesting token: ${e}`);
        });
    }
    //we have gone to the spotify auth and got our code which we can 'swap' for a token
    if (
      window.localStorage.getItem(AUTH_CODE_STORAGE_KEY) &&
      !window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    ) {
      getTokenWithCode(window.localStorage.getItem(AUTH_CODE_STORAGE_KEY));
    }
    //we have not gone to spotify for an auth code yet so we cannot get our token yet
    else if (!code && !error) {
      console.log(`No code found in Home ${code}`);
      gotoAuth();
    }
    //we have gone to spotify and got a code back so we store it in local storage and 'reload' the app to clear the url params
    else if (code && !window.localStorage.getItem(AUTH_CODE_STORAGE_KEY)) {
      console.log(`Code found in Home: ${code}`);
      window.localStorage.setItem(AUTH_CODE_STORAGE_KEY, code);
      //navigate('/', { replace: true });
      window.location.href = REDIRECT_URI;
    }
  }, [code, error, navigate]);

  if (error) {
    return (
      <div>Please accept the usage of Spotify to use this app: {error}</div>
    );
  }

  return <div>Code: {code}</div>;
}

export default Home;
