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
import PlaylistHeader from '../ui/PlaylistHeader';
import BackButton from '../ui/BackButton';

function Playlist() {
  const { playlist, playlistId } = useLoaderData();
  //   console.table('Playlist object: ', playlist);
  //   const [tracks, setTracks] = useState(playlist?.tracks || []);
  const {
    data: tracks,
    getNextPrev,
    hasNext,
    hasPrevious,
  } = usePaginatedFetch(getPlaylistTracks, playlist.tracks, playlistId);
  const navigator = useNavigation();
  //   const navigate = useNavigate();
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
    <div className="playlist-page-colour">
      <User />

      {isLoading ? (
        <div>Loading playlist...</div>
      ) : (
        <>
          <BackButton steps={1} />
          <PlaylistHeader playlist={playlist} />
          <div className="list-container">
            <ul className="list-ul" ref={trackViewElement}>
              {tracks?.items.map((item) => {
                //check that they are only tracks as episodes can also be returned in playlists - could add an EpisodeItem later if it makes any sense
                if (item.track?.type === 'episode' || !item.track) return null;
                //passing the item rather than the track object as it has the added_at property which would be handy to have in the notes
                //   console.table(`item for playlist is: `, item);
                return <TrackItem key={item.track.id} item={item} />;
              })}
            </ul>
          </div>
        </>
      )}
      <div>
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
      </div>
    </div>
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
