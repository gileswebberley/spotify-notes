import { useLoaderData, useNavigation } from 'react-router-dom';
import { getUserPlaylists } from '../services/apiSpotify';
import User from '../ui/User';
import Playlist from '../ui/Playlist';

function Playlists() {
  const playlists = useLoaderData();
  const navigation = useNavigation();
  const isLoading = !playlists || navigation.state === 'loading';
  return (
    <>
      <User />
      <div>Playlists Page</div>
      {isLoading ? (
        <div>Loading playlists...</div>
      ) : (
        <ul>
          {playlists?.items.map((playlist) => (
            <Playlist key={playlist.id} playlist={playlist} />
          ))}
        </ul>
      )}
    </>
  );
}

export async function loader() {
  const playlists = await getUserPlaylists();
  return playlists;
}

export default Playlists;
