import {
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from 'react-router-dom';
import {
  getAccessToken,
  getPlaylistTracks,
  getUserPlaylist,
  isLoggedIn,
  isTokenExpiring,
} from '../services/apiSpotify';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { usePaginatedFetch } from '../query-hooks/usePaginatedFetch';
import TrackItem from '../ui/TrackItem';
import User from '../ui/User';
import PlaylistsPaginationButton from '../ui/PlaylistsPaginationButton';
import { AUTH_PATH } from '../utils/constants';
import PlaylistHeader from '../ui/PlaylistHeader';
import BackButton from '../ui/BackButton';
import { FaEllipsis } from 'react-icons/fa6';
import Spinner from '../ui/Spinner';
import { useIntersection } from '../hooks/useIntersection';

function Playlist() {
  const { playlist, playlistId } = useLoaderData();
  //   console.table('Playlist object: ', playlist);
  //   const [tracks, setTracks] = useState(playlist?.tracks || []);
  const {
    data: tracks,
    getNextPrev,
    hasNext,
  } = usePaginatedFetch(getPlaylistTracks, playlist.tracks, playlistId);
  const navigator = useNavigation();
  //   const navigate = useNavigate();
  const isLoading = navigator.state === 'loading' || !playlist;
  //   const tracks = data ?? { items: [] };

  // const trackViewElement = useRef(null);
  // useLayoutEffect(() => {
  //   if (window.scrollY > 0) {
  //     // window.scrollTo({ top: 0, behavior: 'smooth' });
  //     trackViewElement.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [tracks]);
  let infiniteScrollElementIndex = tracks?.items?.length - 4;
  console.log(`infiniteScrollElement is ${infiniteScrollElementIndex}`);

  const intersectionCallback = useCallback(
    (target) => {
      if (hasNext && !isLoading) {
        console.log(`I'm loading more of the list`);
        getNextPrev(1);
      }
    },
    [isLoading, getNextPrev, hasNext]
  );

  const options = {
    rootMargin: '0px',
    scrollMargin: '0px',
    threshold: 0.5,
    delay: 20,
  };

  const { intersectionTargetRef } = useIntersection(
    intersectionCallback,
    options
  );

  return (
    <div className="playlist-page-colour">
      {isLoading && <Spinner />}
      <BackButton steps={1} />
      <PlaylistHeader playlist={playlist} />
      <div className="list-container">
        <div className="track-list-table">
          <div className="list-header list-row">
            <div className="col-title">Title</div>
            <div className="col-album">Album</div>
            <div className="col-added-by">Added by</div>
            <div className="col-date-added">Date added</div>
            <div className="col-runtime">⏱</div>
            <div className="col-buttons">
              <FaEllipsis />
            </div>
          </div>
          {/* <ul> */}
          {/* <div className="list-row"> */}
          {tracks?.items.map((item, index) => {
            //check that they are only tracks as episodes can also be returned in playlists - could add an EpisodeItem later if it makes any sense
            if (item.track?.type === 'episode' || !item.track) {
              --infiniteScrollElementIndex;
              return null;
            }
            if (infiniteScrollElementIndex === index) {
              return (
                <TrackItem
                  index={index}
                  ref={intersectionTargetRef}
                  key={item.track.id}
                  item={item}
                />
              );
            }
            //passing the item rather than the track object as it has the added_at property which would be handy to have in the notes
            //   console.table(`item for playlist is: `, item);
            return <TrackItem index={index} key={item.track.id} item={item} />;
          })}
          {/* </div> */}
          {/* </ul> */}
        </div>
      </div>
    </div>
  );
}
//need to change this for the use of tanstack query - I'm trying to get it so I can prefetch as I use a different api function for the tracks
// export async function loader({ params }) {
//   if (!isLoggedIn()) {
//     return redirect(AUTH_PATH);
//   }
//   const { playlistId } = params;
//   const playlist = await getUserPlaylist(playlistId);
//   return { playlist, playlistId };
//   //fetch playlist details from spotify api using the playlistId
// }

export const loader =
  (queryClient) =>
  async ({ params }) => {
    if (!isLoggedIn()) {
      return redirect(AUTH_PATH);
    }
    const { playlistId } = params;
    let playlist = null;
    //this means that the first 'page' of a playlist will be cached and then the rest of the tracks (outside of the limit spotify enforces) will be cached by the infinite query that is the backbone of the usePaginatedFetch hook
    //fixing the refresh token problem by adding an enabled to query - not possible in fetchQuery! :(
    try {
      await getAccessToken();
      playlist = await queryClient.fetchQuery({
        queryKey: ['playlist', playlistId],
        queryFn: () => getUserPlaylist(playlistId),
      });
    } catch (error) {
      console.error('Failed to prefetch playlist:', error);
      return { playlist: null, playlistId };
    }
    // const enabled = !isTokenExpiring();
    return { playlist, playlistId };
  };

export default Playlist;
