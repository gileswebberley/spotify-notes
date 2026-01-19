import { NoteUIContextProvider } from '../contexts/NoteUIContext.jsx';
import { useCurrentlyPlaying } from '../query-hooks/useCurrentlyPlaying.js';
import CurrentTrackItem from './CurrentTrackItem.jsx';
// have to consider that we may be adding a note to a track and then it finishes and so we lose the note because the track id changes? hmm
function CurrentlyPlaying() {
  const { status, currentlyPlaying, error } = useCurrentlyPlaying();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  //only show if there is a track (not episode etc) playing and there have been no errors
  if (
    !currentlyPlaying ||
    error ||
    currentlyPlaying.currently_playing_type !== 'track'
  ) {
    return null;
  }

  const { item: track } = currentlyPlaying ?? {};

  return (
    <NoteUIContextProvider trackId={track.id}>
      <CurrentTrackItem current={currentlyPlaying} />
    </NoteUIContextProvider>
  );
}

export default CurrentlyPlaying;
