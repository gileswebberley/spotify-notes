import { MdCancel, MdDeleteForever, MdEditNote, MdSave } from 'react-icons/md';
import { useNoteUIContext } from '../contexts/NoteUIContext';
import { formatDate } from '../utils/helpers';
import IconButton from './IconButton';

function NotesRow() {
  const {
    isAddingOrDeleting,
    editMode,
    setEditMode,
    showNote,
    setShowNote,
    note,
    handleSaveNote,
    handleDeleteNote,
  } = useNoteUIContext();

  if (!showNote) return null;

  return (
    <>
      {showNote && !editMode && (
        // <div className="list-row">
        <div className="list-row notes-row">
          <div className="col-notes">{note?.content}</div>
          <div className="col-date-added">{formatDate(note?.updatedAt)}</div>
          <div className="col-runtime"> </div>
          <div className="col-buttons">
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
        </div>
      )}

      {showNote && editMode && (
        // <div className="list-row">
        <div className="list-row notes-row">
          <form method="post" onSubmit={handleSaveNote}>
            <div className="col-notes">
              <textarea name="noteContent" defaultValue={note?.content} />
            </div>
            <div className="col-date-added">{formatDate(new Date())}</div>
            <div className="col-runtime"> </div>
            <div className="col-buttons">
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
            </div>
          </form>
        </div>
        // </div>
      )}
    </>
  );
}

export default NotesRow;
