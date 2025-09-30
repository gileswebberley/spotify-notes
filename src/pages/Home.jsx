import { useEffect } from 'react';
import { useToken } from '../hooks/useToken';
import { gotoAuth } from '../services/apiSpotify';

function Home() {
  const token = useToken();
  // Redirect to Spotify auth if no token
  useEffect(() => {
    if (!token) {
      gotoAuth();
    }
  }, [token]);

  return <div></div>;
}

export default Home;
