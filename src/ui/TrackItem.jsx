import { FaSpotify } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import ImagePx from './ImagePx';
import NoteUI from './NoteUI';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/apiSpotify';
import IconButton from './IconButton';
import { NoteUIContextProvider } from '../contexts/NoteUIContext';
import NotesRow from './NotesRow';

function TrackItem({ item }) {
  const { name, album, artists, id, duration_ms } = item.track;
  const { added_at, added_by } = item;
  const artistString = artists.map((artist) => artist.name).join(', ');
  const [addedByUser, setAddedByUser] = useState({});
  useEffect(() => {
    if (!addedByUser?.display_name) {
      getUserProfile(added_by?.id)
        .then((result) => setAddedByUser(result))
        .catch(
          (err) =>
            `Failed to get user for added_by in TrackItem - ERROR: ${err}`
        );
    }
  }, [addedByUser?.display_name, added_by?.id]);
  return (
    <NoteUIContextProvider trackId={id}>
      <div className="list-row">
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
        <div className="col-added-by">{addedByUser?.display_name}</div>
        <div className="col-date-added">{formatDate(added_at)}</div>
        <div className="col-runtime">{(duration_ms / 60000).toFixed(2)}</div>
        <div className="col-buttons">
          <a
            href={`https://open.spotify.com/track/${id}`}
            target="_blank"
            rel="noreferrer"
            title={`Open ${name} by ${artistString} in Spotify`}
            aria-description={`open ${name} by ${artistString} in Spotify`}
          >
            <IconButton>
              <FaSpotify />
            </IconButton>
            {/* [Open in Spotify] */}
          </a>
          <NoteUI trackId={id} addedAt={added_at} />
        </div>
      </div>
      <NotesRow />
    </NoteUIContextProvider>
  );
}

export default TrackItem;
