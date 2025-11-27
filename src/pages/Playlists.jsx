import { redirect, useLoaderData, useNavigation } from 'react-router-dom';
import { getUserPlaylists, isLoggedIn } from '../services/apiSpotify';
import User from '../ui/User';
// import Playlist from '../ui/PlaylistItem';
import { useLayoutEffect, useRef } from 'react';
import PlaylistsPaginationButton from '../ui/PlaylistsPaginationButton';
import PlaylistItem from '../ui/PlaylistItem';
import { usePaginatedFetch } from '../hooks/usePaginatedFetch';
import { AUTH_PATH } from '../utils/constants';
import Spinner from '../ui/Spinner';

function Playlists() {
  // let playlists = useLoaderData();
  //on first render we use the loader so the data is there before render
  const loaderData = useLoaderData();
  //then use a bit of state which is initialised with the loader data, so we can rerender when we get next/previous pages
  //extracted all this to a custom hook so that I can use it with tracks in the Playlist page too
  const {
    data: playlists,
    getNextPrev,
    hasNext,
    hasPrevious,
  } = usePaginatedFetch(getUserPlaylists, loaderData);
  //to check the loading state we use the useNavigation hook and it's state
  const navigation = useNavigation();
  const isLoading = !playlists || navigation.state === 'loading';

  //I was scrolling to the top of the page but actually I just want the list to be at the top of the view I think?
  const playlistsViewElement = useRef(null);
  //the pagination works but when the list is updated I want it to scroll to the top of the page so I'll use a little effect hook, the scollY check is to only make it happen after the first list (ie not when we first visit the page)
  useLayoutEffect(() => {
    if (window.scrollY > 0) {
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      playlistsViewElement.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [playlists]);

  return (
    <div>
      {/* <User /> put this into the AppLayout */}
      <h3>Playlists Page</h3>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="list-container">
            <ul ref={playlistsViewElement}>
              {playlists?.items.map((playlist) => (
                <PlaylistItem key={playlist.id} playlist={playlist} />
              ))}
            </ul>
          </div>
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
    </div>
  );
}

export async function loader() {
  if (!isLoggedIn()) {
    return redirect(AUTH_PATH);
  }
  const playlists = await getUserPlaylists();
  return playlists;
}

export default Playlists;
