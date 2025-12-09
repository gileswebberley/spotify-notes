import { useLiveQuery } from 'dexie-react-hooks';
import { useUserContext } from '../contexts/userContext';
import {
  deleteNoteForTrack,
  getUserNoteForTrack,
  saveNoteForTrack,
} from '../services/DexieDB';
import { formatDate } from '../utils/helpers';
import { useState } from 'react';
import {
  MdCancel,
  MdDeleteForever,
  MdNoteAdd,
  MdSave,
  MdEditNote,
  MdPreview,
} from 'react-icons/md';
import IconButton from '../ui/IconButton';
import { BiSolidHide, BiSolidShow } from 'react-icons/bi';

function NoteUI({ trackId, addedAt }) {
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

  if (isLoadingUser) {
    // console.log('is loading user...');
    return null;
  }

  return (
    <>
      {!showNote &&
        (note ? (
          <IconButton
            clickHandler={() => setShowNote(true)}
            disabledProp={isAddingOrDeleting}
            tooltipText="View the note for this track"
          >
            <BiSolidShow />
          </IconButton>
        ) : (
          <IconButton
            disabledProp={isAddingOrDeleting}
            clickHandler={() => setEditMode(true)}
            tooltipText="Add a note to this track"
          >
            <MdNoteAdd />
          </IconButton>
        ))}
      {showNote && (
        <IconButton
          clickHandler={() => setShowNote(false)}
          tooltipText="Hide this note"
        >
          <BiSolidHide />
        </IconButton>
      )}

      {showNote && !editMode && (
        <div className="list-row">
          <div className="notes-row">
            {note?.content}
            <span> ({formatDate(note?.createdAt)})</span>
          </div>
          <IconButton
            clickHandler={() => setEditMode(true)}
            disabledProp={isAddingOrDeleting}
            tooltipText="Edit the note for this track"
          >
            <MdEditNote />
          </IconButton>
          <IconButton
            disabledProp={isAddingOrDeleting}
            clickHandler={handleDeleteNote}
            tooltipText="Delete the note for this track"
          >
            <MdDeleteForever />
          </IconButton>
        </div>
      )}

      {showNote && editMode && (
        <div className="list-row">
          <div className="notes-row">
            <form method="post" onSubmit={handleSaveNote}>
              {/* <input type="hidden" name="trackId" value={trackId} />
          <input type="hidden" name="userId" value={userId} /> */}
              <textarea
                cols={100}
                rows={5}
                name="noteContent"
                defaultValue={note?.content}
              />
              <IconButton
                type="submit"
                disabledProp={isAddingOrDeleting}
                tooltipText="Save your note"
              >
                <MdSave />
              </IconButton>
              <IconButton
                type="cancel"
                disabledProp={isAddingOrDeleting}
                clickHandler={() => {
                  setEditMode(false);
                  setShowNote(false);
                }}
                tooltipText="Cancel changes to this note"
              >
                <MdCancel />
              </IconButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default NoteUI;
