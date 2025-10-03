import { useEffect } from 'react';
// import { useToken } from '../hooks/useToken';
import { gotoAuth } from '../services/apiSpotify';
import { useCodeChallenge } from '../hooks/useCodeChallenge';

function Home() {
  const code = useCodeChallenge();
  if (!code) {
    console.log(`No code found in Home (code is ${code})`);
    gotoAuth();
  }
  // Redirect to Spotify auth if no token
  useEffect(() => {
    // if (!code) {
    //   console.log(`No code found in Home (code is ${code})`);
    //   gotoAuth();
    // }
  }, [code]);

  return <div>The code is: {code}</div>;
}

export default Home;
