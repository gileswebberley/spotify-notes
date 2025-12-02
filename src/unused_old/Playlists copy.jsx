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
  //to check the loading state we use the useNavigation hook and it's state
  // const navigation = useNavigation();
  // const isLoading = !playlists || navigation.state === 'loading';

  //I was scrolling to the top of the page but actually I just want the list to be at the top of the view I think?
  // const playlistsViewElement = useRef(null);
  //the pagination works but when the list is updated I want it to scroll to the top of the page so I'll use a little effect hook, the scollY check is to only make it happen after the first list (ie not when we first visit the page) - UPDATE: going to implement infinite scroll instead
  // useLayoutEffect(() => {
  //   if (window.scrollY > 0) {
  //     // window.scrollTo({ top: 0, behavior: 'smooth' });
  //     playlistsViewElement.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, [playlists]);
  // const intersectionTargetRef = useRef(null);
  // const viewportElementRef = useRef(null);
  let infiniteScrollElementIndex = playlists?.items?.length - 4;
  // const observerRef = useRef(null);

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

  // useEffect(() => {
  //   if (intersectionTargetRef?.current) {
  //     const options = {
  //       root: viewportElementRef?.current,
  //       rootMargin: '0px',
  //       scrollMargin: '0px',
  //       threshold: 0.5,
  //       delay: 1500,
  //     };
  //     observerRef.current = new IntersectionObserver(observerCallback, options);
  //     observerRef.current.observe(intersectionTargetRef.current);
  //   }

  //   return () => {
  //     observerRef?.current?.disconnect();
  //   };
  // }, [intersectionTargetRef, observerCallback]);

  return (
    <div>
      {/* <User /> put this into the AppLayout */}
      <h3>Playlists Page</h3>

      <>
        <div className="list-container">
          <ul>
            {playlists?.items.map((item, index) => {
              if (item.tracks.total < 2) {
                --infiniteScrollElementIndex;
                return null;
              }
              if (index === infiniteScrollElementIndex) {
                return (
                  <>
                    <div
                      key="intersection"
                      width={2}
                      height={1}
                      ref={intersectionTargetRef}
                    ></div>
                    <PlaylistItem key={item.id} playlist={item} />
                  </>
                );
              }
              return <PlaylistItem key={item.id} playlist={item} />;
            })}
          </ul>
          {isLoading && <Spinner />}
        </div>
      </>

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
