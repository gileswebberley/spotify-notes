import { useLoaderData } from 'react-router-dom';
import { getAccessToken } from '../services/apiSpotify';
import User from '../ui/User';

function Playlists() {
  const token = useLoaderData();
  console.log(`Playlists component rendered with token: ${token}`);
  return (
    <>
      <User />
      <div>Playlists Page</div>
    </>
  );
}

export async function loader() {
  const token = await getAccessToken();
  //console.log(menu);
  return token;
}

export default Playlists;
