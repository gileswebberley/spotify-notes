import {
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import {
  getPlaylistTracks,
  getUserPlaylist,
  isLoggedIn,
} from '../services/apiSpotify';
import { useLayoutEffect, useRef, useState } from 'react';
import { usePaginatedFetch } from '../hooks/usePaginatedFetch';
import TrackItem from '../ui/TrackItem';
import User from '../ui/User';
import PlaylistsPaginationButton from '../ui/PlaylistsPaginationButton';
import { AUTH_PATH } from '../utils/constants';

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
            {tracks?.items.map((item) => {
              //check that they are only tracks as episodes can also be returned in playlists - could add an EpisodeItem later if it makes any sense
              if (item.track.type === 'episode') return null;
              //passing the item rather than the track object as it has the added_at property which would be handy to have in the notes
              return <TrackItem key={item.track.id} item={item} />;
            })}
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
  if (!isLoggedIn()) {
    return redirect(AUTH_PATH);
  }
  const { playlistId } = params;
  const playlist = await getUserPlaylist(playlistId);
  return { playlist, playlistId };
  //fetch playlist details from spotify api using the playlistId
}

export default Playlist;
