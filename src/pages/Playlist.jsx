import { useLoaderData, useNavigate, useNavigation } from 'react-router-dom';
import { getPlaylistTracks, getUserPlaylist } from '../services/apiSpotify';
import { useLayoutEffect, useRef, useState } from 'react';
import { usePaginatedFetch } from '../hooks/usePaginatedFetch';
import TrackItem from '../ui/TrackItem';
import User from '../ui/User';
import PlaylistsPaginationButton from '../ui/PlaylistsPaginationButton';

function Playlist() {
  const { playlist, playlistId } = useLoaderData();
  //   const [tracks, setTracks] = useState(playlist?.tracks || []);
  const {
    data: tracks,
    getNextPrev,
    hasNext,
    hasPrevious,
  } = usePaginatedFetch(getPlaylistTracks, playlist.tracks, playlistId);
  const navigator = useNavigation();
  const navigate = useNavigate();
  const isLoading = navigator.state === 'loading' || !playlist;
  //   const tracks = data ?? { items: [] };

  const trackViewElement = useRef(null);
  useLayoutEffect(() => {
    if (window.scrollY > 0) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      trackViewElement.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [tracks]);

  return (
    <>
      <User />

      {isLoading ? (
        <div>Loading playlists...</div>
      ) : (
        <>
          <button onClick={() => navigate('/playlists')}>
            Back to Playlists
          </button>
          <h3>Playlist: {playlist?.name}</h3>
          <ul ref={trackViewElement}>
            {tracks?.items.map((track) => (
              <TrackItem key={track.id} track={track.track} />
            ))}
          </ul>
        </>
      )}
      {hasPrevious && (
        <PlaylistsPaginationButton
          handler={() => getNextPrev(-1)}
          title={'Previous'}
        />
      )}
      {hasNext && (
        <PlaylistsPaginationButton
          handler={() => getNextPrev(1)}
          title={'Next'}
        />
      )}
    </>
  );
}

export async function loader({ params }) {
  const { playlistId } = params;
  const playlist = await getUserPlaylist(playlistId);
  return { playlist, playlistId };
  //fetch playlist details from spotify api using the playlistId
}

export default Playlist;
