import { useLiveQuery } from 'dexie-react-hooks';
import { useUserContext } from '../contexts/userContext';
import {
  deleteNoteForTrack,
  getUserNoteForTrack,
  saveNoteForTrack,
} from '../services/DexieDB';
import { formatDate } from '../utils/helpers';
import { useState } from 'react';

function NoteUI({ trackId }) {
  const [editMode, setEditMode] = useState(false);
  const { isLoadingUser, getUserId } = useUserContext();
  const [isAddingOrDeleting, setIsAddingOrDeleting] = useState(false);
  let userId = null;
  //useLiveQuery is a hook provided by dexie-react-hooks which allows us to run a Dexie query and have the component re-render when the result changes
  const note = useLiveQuery(async () => {
    if (!isLoadingUser) {
      userId = getUserId();
      return await getNote(userId, trackId);
    }
  }, [isLoadingUser, userId]);

  //simply extracted to keep useLiveQuery cleaner
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
    setIsAddingOrDeleting(true);
    const formData = new FormData(event.target);
    const noteContent = formData.get('noteContent');
    const userId = getUserId();
    try {
      const savedNote = await saveNoteForTrack(userId, trackId, noteContent);
      console.log('Note saved:', savedNote);
      // return savedNote;
      setEditMode(false);
      setIsAddingOrDeleting(false);
    } catch (e) {
      console.error('Error saving note:', e);
      throw e;
    } finally {
      setIsAddingOrDeleting(false);
    }
  }

  async function handleDeleteNote(event) {
    setIsAddingOrDeleting(true);
    if (window.confirm('Are you sure you want to delete this note?')) {
      const userId = getUserId();
      try {
        const deleted = await deleteNoteForTrack(userId, trackId);
        if (deleted) {
          console.log('Note deleted');
        } else {
          console.log('No note to delete');
        }
      } catch (e) {
        console.error('Error deleting note:', e);
        throw e;
      } finally {
        setIsAddingOrDeleting(false);
      }
    } else {
      setIsAddingOrDeleting(false);
      //remove focus from button when deleting is cancelled
      event.target.blur();
    }
  }

  if (isLoadingUser) {
    // console.log('is loading user...');
    return null;
  }

  if (!note && !editMode) {
    // console.log('no note found for this track');
    return (
      <button disabled={isAddingOrDeleting} onClick={() => setEditMode(true)}>
        add note
      </button>
    );
  }

  return (
    <>
      {!editMode && note ? (
        <details>
          <summary>View Note</summary>
          <div>
            {note?.content}
            <span> ({formatDate(note?.createdAt)})</span>
            <button onClick={() => setEditMode(true)}>edit</button>
            <button disabled={isAddingOrDeleting} onClick={handleDeleteNote}>
              delete
            </button>
          </div>
        </details>
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
          <button type="submit" disabled={isAddingOrDeleting}>
            Save Note
          </button>
        </form>
      )}
    </>
  );
}

export default NoteUI;
