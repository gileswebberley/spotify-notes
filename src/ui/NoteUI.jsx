import { useLiveQuery } from 'dexie-react-hooks';
import { useUserContext } from '../contexts/userContext';
import { getUserNoteForTrack, saveNoteForTrack } from '../services/DexieDB';
import { formatDate } from '../utils/helpers';

function NoteUI({ trackId }) {
  const { isLoadingUser, getUserId } = useUserContext();
  let userId = null;
  //useLiveQuery is a hook provided by dexie-react-hooks which allows us to run a Dexie query and have the component re-render when the result changes
  const note = useLiveQuery(async () => {
    if (!isLoadingUser && !userId) {
      userId = getUserId();
      try {
        // console.log('live query is calling getUserNoteForTrack....');
        const note = await getUserNoteForTrack(userId, trackId);
        // console.table('Fetched note in live query:', note);
        return note;
      } catch (e) {
        console.error(`Failed to get note for track id ${trackId}:`, e);
        throw e;
      }
    }
  }, [isLoadingUser, userId]);

  if (isLoadingUser) {
    // console.log('is loading user...');
    return null;
  }

  if (!note) {
    // console.log('no note found for this track');
    return <button>add note</button>;
  }

  return (
    <div>
      {`note: ${note?.content}`}
      <span> ({formatDate(note?.createdAt)})</span>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  const noteContent = formData.get('noteContent');
  const trackId = formData.get('trackId');
  const userId = formData.get('userId');
  try {
    const savedNote = await saveNoteForTrack(userId, trackId, noteContent);
    console.log('Note saved:', savedNote);
    return savedNote;
  } catch (e) {
    console.error('Error saving note:', e);
    throw e;
  }
}

export default NoteUI;
