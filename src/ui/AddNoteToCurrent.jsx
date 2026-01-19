import { useState } from 'react';
import IconButton from './IconButton';
import { FaPlay, FaPlus } from 'react-icons/fa6';
import CurrentlyPlaying from './CurrentlyPlaying';

function AddNoteToCurrent() {
  const [open, setOpen] = useState(false);
  //   const {}

  //   if (!open) {
  //     return (
  //       <IconButton
  //         clickHandler={() => setOpen(true)}
  //         tooltipText="Add a note to the currently playing track"
  //       >
  //         <FaPlay />
  //         <FaPlus />
  //       </IconButton>
  //     );
  //   }
  //   if (open) {
  return (
    <>
      <button
        className="add-current-note-button icon-button"
        onClick={() => setOpen(!open)}
        title="Add a note to the track currently playing on Spotify"
        aria-description="Add a note to the track currently playing on Spotify"
        popoverTarget="currentNotePopover"
      >
        <FaPlay style={open && { transform: 'rotate(90deg)' }} />
        <FaPlus />
      </button>
      <div
        className="add-current-note-container"
        id="currentNotePopover"
        popover="manual"
      >
        {open && (
          <div className="list-container">
            <div className="track-list-table">
              <CurrentlyPlaying />
            </div>
          </div>
        )}
      </div>
    </>
  );
  //   }
  //   return <div></div>;
}

export default AddNoteToCurrent;
