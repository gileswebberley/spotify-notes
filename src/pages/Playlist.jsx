import { useLoaderData, useNavigation } from 'react-router-dom';
import PlaylistHeader from '../ui/PlaylistHeader';
import PlaylistTracks from '../ui/PlaylistTracks';
import BackButton from '../ui/BackButton';

function Playlist() {
  const { playlist, playlistId } = useLoaderData();
  const navigator = useNavigation();
  const isLoading = navigator.state === 'loading';

  return (
    <div className="playlist-page-colour">
      {isLoading && <Spinner />}
      <BackButton steps={1} />
      <PlaylistHeader playlist={playlist} />
      <PlaylistTracks
        key={playlistId}
        initialTracks={playlist?.tracks}
        playlistId={playlistId}
      />
    </div>
  );
}

// export const loader =
//   see playlistLoader.js for the loader function required to make tanstack-query and react-router work together (it's a curried function that injects queryClient and then uses the closure principle to allow use of fetchQuery - phew)

export default Playlist;
