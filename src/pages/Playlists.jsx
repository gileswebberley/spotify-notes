import { useLoaderData } from 'react-router-dom';
import { getAccessToken } from '../services/apiSpotify';

function Playlists() {
  const token = useLoaderData();
  console.log(`Playlists component rendered with token: ${token}`);
  return <div>PLAYLISTS</div>;
}

export async function loader() {
  const token = await getAccessToken();
  //console.log(menu);
  return token;
}

export default Playlists;
