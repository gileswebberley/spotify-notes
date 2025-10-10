import { useEffect } from 'react';
// import { useToken } from '../hooks/useToken';
import { gotoAuth, requestToken } from '../services/apiSpotify';
import { useCodeChallenge } from '../hooks/useCodeChallenge';
import {
  ACCESS_TOKEN_STORAGE_KEY,
  AUTH_CODE,
  REDIRECT_URI,
} from '../utils/constants';
import { useNavigate } from 'react-router-dom';

function Home() {
  console.log('Home component rendered');
  const { code, error } = useCodeChallenge();
  //   const authorized = useRef(false);
  const navigate = useNavigate();
  //code is the ref.current - if no value then we have not gone to spotify for an auth code, if it has a value then it is the code that has been returned
  useEffect(() => {
    async function getTokenWithCode(code) {
      await requestToken(code)
        .then(() => {
          console.log(`Token successfully requested`);
          window.localStorage.removeItem(AUTH_CODE);
          navigate('/playlists', { replace: true });
        })
        .catch((e) => {
          console.error(`Error requesting token: ${e}`);
        });
    }
    if (
      window.localStorage.getItem(AUTH_CODE) &&
      !window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
    ) {
      getTokenWithCode(window.localStorage.getItem(AUTH_CODE));
    } else if (!code && !error) {
      console.log(`No code found in Home ${code}`);
      gotoAuth();
    } else if (code && !window.localStorage.getItem(AUTH_CODE)) {
      console.log(`Code found in Home: ${code}`);
      window.localStorage.setItem(AUTH_CODE, code);
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
