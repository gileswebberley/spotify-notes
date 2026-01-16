import { useCurrentlyPlaying } from '../query-hooks/useCurrentlyPlaying.js';

function CurrentlyPlaying() {
  const { status, fetchStatus, currentlyPlaying, error } =
    useCurrentlyPlaying();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  //only show if there is a track playing and there have been no errors
  if (
    error ||
    !currentlyPlaying.is_playing ||
    currentlyPlaying.currently_playing_type !== 'track'
  ) {
    return null;
  }

  return <div></div>;
}

export default CurrentlyPlaying;
