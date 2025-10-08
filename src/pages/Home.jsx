import { useEffect } from 'react';
// import { useToken } from '../hooks/useToken';
import { gotoAuth, requestToken } from '../services/apiSpotify';
import { useCodeChallenge } from '../hooks/useCodeChallenge';
import { ACCESS_TOKEN_STORAGE_KEY } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { code, error } = useCodeChallenge();
  const navigate = useNavigate();
  //code is the ref.current - if no value then we have not gone to spotify for an auth code, if it has a value then it is the code that has been returned
  if (!code && !error) {
    // console.log(`No code found in Home`);
    gotoAuth();
  } else if (error) {
    return <div>Error during authentication: {error}</div>;
  } else if (code && !window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)) {
    // console.log(`Code found in Home: ${code}`);
    requestToken(code)
      .then(() => {
        console.log(`Token successfully requested`);
        navigate('/playlists');
      })
      .catch((e) => {
        console.error(`Error requesting token: ${e}`);
      });
  }

  return <div>The code is: {code}</div>;
}

export default Home;
