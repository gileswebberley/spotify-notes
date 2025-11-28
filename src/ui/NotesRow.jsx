import { MdCancel, MdDeleteForever, MdEditNote, MdSave } from 'react-icons/md';
import { useNoteUIContext } from '../contexts/NoteUIContext';
import { formatDate } from '../utils/helpers';
import IconButton from './IconButton';

function NotesRow() {
  const {
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
  } = useNoteUIContext();

  if (!showNote) return null;

  return (
    <>
      {showNote && !editMode && (
        // <div className="list-row">
        <div className="notes-row">
          {note?.content}
          <span> ({formatDate(note?.createdAt)})</span>
          {/* </div> */}
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
        // <div className="list-row">
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
        // </div>
      )}
    </>
  );
}

export default NotesRow;
