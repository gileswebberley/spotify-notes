import { useLiveQuery } from 'dexie-react-hooks';
import { useUserContext } from '../contexts/userContext';
import { getUserNoteForTrack } from '../services/DexieDB';

function NoteUI({ trackId }) {
  const { isLoadingUser, getUserId } = useUserContext();
  let userId = null;
  //useLiveQuery is a hook provided by dexie-react-hooks which allows us to run a Dexie query and have the component re-render when the result changes
  const note = useLiveQuery(async () => {
    if (!isLoadingUser && !userId) {
      userId = getUserId();
      try {
        console.log('live query is calling getUserNoteForTrack....');
        const note = await getUserNoteForTrack(userId, trackId);
        console.table('Fetched note in live query:', note);
        return note;
      } catch (e) {
        console.error(`Failed to get note for track id ${trackId}:`, e);
        throw e;
      }
    }
  }, [isLoadingUser, userId]);

  if (isLoadingUser) {
    // console.log('is loading user...');
    return <div>Loading user info to check for notes</div>;
  }

  return (
    <div>
      userid: {userId} trackId: {trackId}{' '}
      {note ? ` note: ${note?.content}` : ' no note'}
    </div>
  );
}

export default NoteUI;
