import { useLoaderData, useNavigation } from 'react-router-dom';
import { getUserPlaylists } from '../services/apiSpotify';
import User from '../ui/User';
// import Playlist from '../ui/PlaylistItem';
import { useLayoutEffect, useRef, useState } from 'react';
import PlaylistsPaginationButton from '../ui/PlaylistsPaginationButton';
import PlaylistItem from '../ui/PlaylistItem';

function Playlists() {
  // let playlists = useLoaderData();
  //on first render we use the loader so the data is there before render
  const loaderData = useLoaderData();
  //then use a bit of state which is initialised with the loader data, so we can rerender when we get next/previous pages
  const [playlists, setPlaylists] = useState(loaderData);
  //to check the loading state we use the useNavigation hook and it's state
  const navigation = useNavigation();
  const isLoading = !playlists || navigation.state === 'loading';
  //first attempt at implementing a next button for pagination
  let hasNext = playlists?.next;
  if (hasNext) {
    hasNext = new URL(hasNext);
  }
  let hasPrevious = playlists?.previous;
  if (hasPrevious) {
    hasPrevious = new URL(hasPrevious);
  }
  //let's do direction as a positive number for next and negative for previous
  const getNextPrevPlaylists = async (direction) => {
    if (hasNext && direction > 0) {
      const offset = hasNext.searchParams.get('offset') || 0;
      const limit = hasNext.searchParams.get('limit') || 50;
      await getUserPlaylists(offset, limit).then((data) => {
        setPlaylists(data);
      });
    }
    if (hasPrevious && direction < 0) {
      const offset = hasPrevious.searchParams.get('offset') || 0;
      const limit = hasPrevious.searchParams.get('limit') || 50;
      await getUserPlaylists(offset, limit).then((data) => {
        setPlaylists(data);
      });
    }
  };
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
    <>
      <User />
      <h3>Playlists Page</h3>
      {isLoading ? (
        <div>Loading playlists...</div>
      ) : (
        <ul ref={playlistsViewElement}>
          {playlists?.items.map((playlist) => (
            <PlaylistItem key={playlist.id} playlist={playlist} />
          ))}
        </ul>
      )}
      {hasPrevious && (
        <PlaylistsPaginationButton
          handler={() => getNextPrevPlaylists(-1)}
          title={'Previous'}
        />
      )}
      {hasNext && (
        <PlaylistsPaginationButton
          handler={() => getNextPrevPlaylists(1)}
          title={'Next'}
        />
      )}
    </>
  );
}

export async function loader() {
  const playlists = await getUserPlaylists();
  return playlists;
}

export default Playlists;
