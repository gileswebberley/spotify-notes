import { MdNoteAdd } from 'react-icons/md';
import IconButton from './IconButton';
import { BiSolidHide, BiSolidShow } from 'react-icons/bi';
import { useNoteUIContext } from '../contexts/NoteUIContext';

function NoteUI() {
  const {
    isAddingOrDeleting,
    setEditMode,
    showNote,
    setShowNote,
    isLoadingUser,
    note,
  } = useNoteUIContext();

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
            clickHandler={() => {
              setShowNote(true);
              setEditMode(true);
            }}
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
    </>
  );
}

export default NoteUI;
