import { FaSpotify } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import ImagePx from './ImagePx';
import NoteUI from './NoteUI';
import IconButton from './IconButton';
import { NoteUIContextProvider } from '../contexts/NoteUIContext';
import NotesRow from './NotesRow';
import { useUser } from '../query-hooks/useUser';
import { forwardRef } from 'react';

//forwardRef for use with useIntersection for infinite scroll behaviour
const TrackItem = forwardRef(({ item }, ref) => {
  const { name, album, artists, id, duration_ms } = item.track;
  const { added_at, added_by } = item;
  const artistString = artists.map((artist) => artist.name).join(', ');
  //Great, this works nicely
  const { status, fetchStatus, user, error } = useUser(added_by.id);
  const { display_name } = user ?? {};
  return (
    <NoteUIContextProvider trackId={id}>
      <div className="list-row">
        <div className="col-title" ref={ref}>
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
        <div className="col-added-by">
          {status === 'pending'
            ? 'loading...'
            : status === 'error'
            ? '-'
            : display_name}
        </div>
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
});

export default TrackItem;
