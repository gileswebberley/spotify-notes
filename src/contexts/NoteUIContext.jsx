import { createContext, useContext, useState } from 'react';
import { useUserContext } from './UserContext';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  deleteNoteForTrack,
  getUserNoteForTrack,
  saveNoteForTrack,
} from '../services/DexieDB';

const NoteUIContext = createContext(null);

function NoteUIContextProvider({ children, trackId }) {
  const [editMode, setEditMode] = useState(false);
  const [showNote, setShowNote] = useState(false);
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
      //   setIsAddingOrDeleting(false);
    } catch (e) {
      console.error('Error saving note:', e);
      throw e;
    } finally {
      setEditMode(false);
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

  return (
    <NoteUIContext.Provider
      value={{
        isAddingOrDeleting,
        setIsAddingOrDeleting,
        editMode,
        setEditMode,
        showNote,
        setShowNote,
        isLoadingUser,
        getUserId,
        note,
        handleSaveNote,
        handleDeleteNote,
      }}
    >
      {children}
    </NoteUIContext.Provider>
  );
}

function useNoteUIContext() {
  const context = useContext(NoteUIContext);
  if (!context) {
    throw new Error(
      'useNoteUIContext must be used within a NoteUIContextProvider'
    );
  }
  return context;
}

export { useNoteUIContext, NoteUIContextProvider };
