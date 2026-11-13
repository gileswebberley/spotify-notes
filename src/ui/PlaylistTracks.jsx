import { useCallback } from 'react';
import { usePaginatedFetch } from '../query-hooks/usePaginatedFetch';
import { useIntersection } from '../hooks/useIntersection';
import { getPlaylistTracks } from '../services/apiSpotify';
import TrackItem from '../ui/TrackItem';
import { FaEllipsis } from 'react-icons/fa6';
import Spinner from '../ui/Spinner';
import { NoteUIContextProvider } from '../contexts/NoteUIContext';

function PlaylistTracks({ initialTracks, playlistId }) {
  // When I came back to work on this I realised that my loader was wrong and should throw an error rather than passing back {playlist: null, playlistId} because that leaves this whole page in a broken state!! With this change I think I can remove the isLoading check of playlist as the loader will always resolve the valid playlist object, redirect to AUTH, or throw an error to the Error component
  const {
    data: tracks,
    getNextPrev,
    hasNext,
    isLoading: isFetchingTracks,
  } = usePaginatedFetch(getPlaylistTracks, initialTracks, playlistId); //playlist.tracks deprecated, now playlist.items which also has limit, next, previous, offset, and total properties that this hook uses to set up the initial state of the infinite query
  // trigger the infinite scroll loading when the 4th last element is coming into view (we take one away from this if any tracks are filtered out of the list)
  let infiniteScrollElementIndex = tracks?.items?.length - 4;
  // console.log(`infiniteScrollElement is ${infiniteScrollElementIndex}`);

  const intersectionCallback = useCallback(() => {
    if (hasNext && !isFetchingTracks) {
      console.log(`I'm loading more of the list`);
      getNextPrev(1);
    }
  }, [isFetchingTracks, getNextPrev, hasNext]);

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
    <div className="list-container">
      {isFetchingTracks && <Spinner />}
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
          //check that they are only tracks as episodes can also be returned in playlists - could add an EpisodeItem later if it makes any sense - track is now deprecated so must use item instead!!
          if (item.item?.type === 'episode' || !item.item) {
            --infiniteScrollElementIndex;
            return null;
          }
          if (infiniteScrollElementIndex === index) {
            return (
              <NoteUIContextProvider key={item.item.id} trackId={item.item.id}>
                <TrackItem
                  index={index}
                  ref={intersectionTargetRef}
                  // key={item.item.id}
                  item={item}
                />
              </NoteUIContextProvider>
            );
          }
          //passing the item rather than the track object as it has the added_at property which would be handy to have in the notes
          //   console.table(`item for playlist is: `, item);
          return (
            <NoteUIContextProvider key={item.item.id} trackId={item.item.id}>
              <TrackItem index={index} item={item} />
            </NoteUIContextProvider>
          );
        })}
        {/* </div> */}
        {/* </ul> */}
      </div>
    </div>
  );
}

export default PlaylistTracks;
