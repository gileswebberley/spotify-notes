import { useLiveQuery } from 'dexie-react-hooks';
import { useUserContext } from '../contexts/userContext';
import { getUserNoteForTrack, saveNoteForTrack } from '../services/DexieDB';
import { formatDate } from '../utils/helpers';
import { useState } from 'react';

function NoteUI({ trackId }) {
  const [editMode, setEditMode] = useState(false);
  const { isLoadingUser, getUserId } = useUserContext();
  let userId = null;
  //useLiveQuery is a hook provided by dexie-react-hooks which allows us to run a Dexie query and have the component re-render when the result changes
  const note = useLiveQuery(async () => {
    if (!isLoadingUser) {
      //} && !userId) {
      userId = getUserId();
      return await getNote(userId, trackId);
    }
  }, [isLoadingUser, userId]);

  async function getNote(userId, trackId) {
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

  async function handleSaveNote(event) {
    event.preventDefault();
    console.log(`Testing update of note with userId: ${getUserId()}`);
    const formData = new FormData(event.target);
    const noteContent = formData.get('noteContent');
    const userId = getUserId();
    // const trackId = formData.get('trackId');
    // const userId = formData.get('userId');
    try {
      const savedNote = await saveNoteForTrack(userId, trackId, noteContent);
      console.log('Note saved:', savedNote);
      // return savedNote;
      setEditMode(false);
    } catch (e) {
      console.error('Error saving note:', e);
      throw e;
    }
  }

  if (isLoadingUser) {
    // console.log('is loading user...');
    return null;
  }

  if (!note && !editMode) {
    // console.log('no note found for this track');
    return <button onClick={() => setEditMode(true)}>add note</button>;
  }

  return (
    <>
      {!editMode ? (
        <div>
          note: {note?.content}
          <span> ({formatDate(note?.createdAt)})</span>
          <button onClick={() => setEditMode(true)}>edit</button>
        </div>
      ) : (
        <form method="post" onSubmit={handleSaveNote}>
          {/* <input type="hidden" name="trackId" value={trackId} />
          <input type="hidden" name="userId" value={userId} /> */}
          <textarea
            cols={100}
            rows={5}
            name="noteContent"
            defaultValue={note?.content}
          />
          <button type="submit">Save Note</button>
        </form>
      )}
    </>
  );
}

export default NoteUI;
