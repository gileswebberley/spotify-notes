import { MdCancel, MdDeleteForever, MdEditNote, MdSave } from 'react-icons/md';
import { useNoteUIContext } from '../contexts/NoteUIContext';
import { formatDate } from '../utils/helpers';
import IconButton from './IconButton';
import { MAX_NOTE_CHARS } from '../utils/constants';
import { useState } from 'react';

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

  const [messageLength, setMessageLength] = useState(
    () => note?.content?.length ?? 0
  );

  function countChars(e) {
    setMessageLength(e.target.value.length);
  }

  function handleDeleteNoteAndHide(event) {
    handleDeleteNote(event);
    setShowNote(false);
  }

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
              clickHandler={handleDeleteNoteAndHide}
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
              <textarea
                name="noteContent"
                defaultValue={note?.content}
                aria-description="Type your note in here"
                disabled={isAddingOrDeleting}
                onChange={countChars}
                maxLength={MAX_NOTE_CHARS}
              />
              {messageLength}/{MAX_NOTE_CHARS}
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
                  if (messageLength === 0) {
                    setShowNote(false);
                  }
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
