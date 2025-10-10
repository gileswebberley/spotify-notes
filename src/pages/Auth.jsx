import { useEffect } from 'react';
import { requestToken } from '../services/apiSpotify';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN_STORAGE_KEY, AUTH_CODE } from '../utils/constants';

function Auth() {
  const navigate = useNavigate();
  const code = window.localStorage.getItem(AUTH_CODE);
  useEffect(() => {
    async function getTokenWithCode(code) {
      await requestToken(code)
        .then(() => {
          console.log(`Token successfully requested`);
          navigate('/playlists');
        })
        .catch((e) => {
          console.error(`Error requesting token: ${e}`);
        });
    }
    if (!window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) && code) {
      getTokenWithCode(code);
    } else if (!code) {
      navigate('/');
    }
    // document.title = 'Auth Page';
  }, [navigate, code]);

  return <div>AUTH PAGE</div>;
}

export default Auth;
