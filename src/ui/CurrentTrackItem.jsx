import { getArtistsString } from '../utils/helpers';
import { useNoteUIContext } from '../contexts/NoteUIContext';
import IconButton from './IconButton';
import { FaPause, FaPlay } from 'react-icons/fa6';
import ImagePx from './ImagePx';
import NoteUI from './NoteUI';
import NotesRow from './NotesRow';

function CurrentTrackItem({ current }) {
  const { showNote, editMode } = useNoteUIContext();
  const { is_playing } = current ?? {};
  const { name, album, artists, id, duration_ms } = current.item ?? {};
  const artistString = getArtistsString(artists);

  return (
    <>
      <div className={`list-row ${showNote ? 'note-open' : ''}`}>
        <div className="col-title">
          <ImagePx images={album?.images} size={64} name={name} />
          <div className="ellipsis-text-block">
            <span className="track-name-font">{name}</span>
            <br />
            {artistString}
          </div>
        </div>
        <div className="col-album">
          <div className="ellipsis-text-block">{album.name}</div>
        </div>
        <div className="col-added-by"></div>
        <div className="col-date-added"></div>
        <div className="col-runtime">{(duration_ms / 60000).toFixed(2)}</div>
        <div className="col-buttons">
          {is_playing ? (
            <IconButton>
              <FaPause />
            </IconButton>
          ) : (
            <IconButton>
              <FaPlay />
            </IconButton>
          )}
          <NoteUI />
        </div>
      </div>
      <NotesRow />
    </>
  );
}

export default CurrentTrackItem;
