import { redirect, useLoaderData, useNavigation } from 'react-router-dom';
import { getUserPlaylists, isLoggedIn } from '../services/apiSpotify';
import User from '../ui/User';
// import Playlist from '../ui/PlaylistItem';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import PlaylistsPaginationButton from '../ui/PlaylistsPaginationButton';
import PlaylistItem from '../ui/PlaylistItem';
import { usePaginatedFetch } from '../query-hooks/usePaginatedFetch';
import { AUTH_PATH } from '../utils/constants';
import Spinner from '../ui/Spinner';
import { useIntersection } from '../hooks/useIntersection';

function Playlists() {
  //extracted all this to a custom hook so that I can use it with tracks in the Playlist page too
  const {
    data: playlists,
    getNextPrev,
    hasNext,
    hasPrevious,
    isLoading,
  } = usePaginatedFetch(getUserPlaylists, null);

  let infiniteScrollElementIndex = playlists?.items?.length - 4;

  const intersectionCallback = useCallback(
    (target) => {
      if (hasNext && !isLoading) {
        console.log(`I'm loading more of the list`);
        getNextPrev(1);
      }
    },
    [isLoading, getNextPrev, hasNext]
  );

  const { intersectionTargetRef } = useIntersection(intersectionCallback);

  return (
    <div>
      {/* <User /> put this into the AppLayout */}
      <h3>Playlists Page</h3>
      <div className="list-container">
        <ul>
          {playlists?.items.map((item, index) => {
            if (item.tracks.total < 2) {
              --infiniteScrollElementIndex;
              return null;
            }
            if (index === infiniteScrollElementIndex) {
              return (
                <PlaylistItem
                  ref={intersectionTargetRef}
                  key={item.id}
                  playlist={item}
                />
              );
            }
            return <PlaylistItem key={item.id} playlist={item} />;
          })}
        </ul>
        {isLoading && <Spinner />}
      </div>
    </div>
  );
}

//Now using react-query so it loads the first 20 and caches them, unlike in Playlist (singular) the first call to usePaginatedFetch is the same function so we can do it this way
export async function loader() {
  if (!isLoggedIn()) {
    return redirect(AUTH_PATH);
  }
  // const playlists = await getUserPlaylists();
  // return playlists;
  return null;
}

export default Playlists;
