import { useLoaderData, useNavigation } from 'react-router-dom';
import { getPlaylistTracks } from '../services/apiSpotify';
import { useCallback } from 'react';
import { usePaginatedFetch } from '../query-hooks/usePaginatedFetch';
import TrackItem from '../ui/TrackItem';
import PlaylistHeader from '../ui/PlaylistHeader';
import BackButton from '../ui/BackButton';
import { FaEllipsis } from 'react-icons/fa6';
import Spinner from '../ui/Spinner';
import { useIntersection } from '../hooks/useIntersection';
import { NoteUIContextProvider } from '../contexts/NoteUIContext';

function Playlist_Original() {
  const { playlist, playlistId } = useLoaderData();
  // When I came back to work on this I realised that my loader was wrong and should throw an error rather than passing back {playlist: null, playlistId} because that leaves this whole page in a broken state!! With this change I think I can remove the isLoading check of playlist as the loader will always resolve the valid playlist object, redirect to AUTH, or throw an error to the Error component
  const {
    data: tracks,
    getNextPrev,
    hasNext,
    isLoading: isFetchingTracks,
  } = usePaginatedFetch(getPlaylistTracks, playlist?.tracks, playlistId); //playlist.tracks has limit, next, previous, offset, and total properties that this hook uses to set up the initial state of the infinite query
  const navigator = useNavigation();
  // const isLoading = navigator.state === 'loading' || !playlist;
  const isLoading = navigator.state === 'loading' || isFetchingTracks;
  // trigger the infinite scroll loading when the 4th last element is coming into view (we take one away from this if any tracks are filtered out of the list)
  let infiniteScrollElementIndex = tracks?.items?.length - 4;
  // console.log(`infiniteScrollElement is ${infiniteScrollElementIndex}`);

  const intersectionCallback = useCallback(() => {
    if (hasNext && !isLoading) {
      console.log(`I'm loading more of the list`);
      getNextPrev(1);
    }
  }, [isLoading, getNextPrev, hasNext]);

  const options = {
    rootMargin: '0px',
    scrollMargin: '0px',
    threshold: 0.5,
    delay: 20,
  };

  const { intersectionTargetRef } = useIntersection(
    intersectionCallback,
    options,
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
                <NoteUIContextProvider
                  key={item.track.id}
                  trackId={item.track.id}
                >
                  <TrackItem
                    index={index}
                    ref={intersectionTargetRef}
                    // key={item.track.id}
                    item={item}
                  />
                </NoteUIContextProvider>
              );
            }
            //passing the item rather than the track object as it has the added_at property which would be handy to have in the notes
            //   console.table(`item for playlist is: `, item);
            return (
              <NoteUIContextProvider
                key={item.track.id}
                trackId={item.track.id}
              >
                <TrackItem index={index} item={item} />
              </NoteUIContextProvider>
            );
          })}
          {/* </div> */}
          {/* </ul> */}
        </div>
      </div>
    </div>
  );
}
// //need to change this for the use of tanstack query - I'm trying to get it so I can prefetch as I use a different api function for the tracks
// // export async function loader({ params }) {
// //   if (!isLoggedIn()) {
// //     return redirect(AUTH_PATH);
// //   }
// //   const { playlistId } = params;
// //   const playlist = await getUserPlaylist(playlistId);
// //   return { playlist, playlistId };
// //   //fetch playlist details from spotify api using the playlistId
// // }

// export const loader =
//   see playlistLoader.js for the loader function required to make tanstack-query and react-router work together (it's a curried function that injects queryClient and then uses the closure principle to allow use of fetchQuery - phew)

export default Playlist_Original;
