import { useEffect, useRef, useState } from 'react';
// import { useToken } from '../hooks/useToken';
import { gotoAuth, requestToken } from '../services/apiSpotify';
import { getCodeChallenge } from '../hooks/getCodeChallenge';
import { ACCESS_TOKEN_STORAGE_KEY, REDIRECT_URI } from '../utils/constants';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { code, error } = getCodeChallenge();
  const authorized = useRef(false);
  const navigate = useNavigate();
  //code is the ref.current - if no value then we have not gone to spotify for an auth code, if it has a value then it is the code that has been returned
  if (!code) {
    console.log(`No code found in Home ${code}`);
    gotoAuth();
    // authorized.current = true;
  } else if (error) {
    return <div>Error during authentication: {error}</div>;
  } else {
    window.location.href = REDIRECT_URI;
    authorized.current = true;
  }

  if (
    !window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY) &&
    authorized.current &&
    code
  ) {
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
