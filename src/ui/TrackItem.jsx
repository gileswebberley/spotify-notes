import { FaSpotify } from 'react-icons/fa';
import { formatDate } from '../utils/helpers';
import ImagePx from './ImagePx';
import NoteUI from './NoteUI';

function TrackItem({ item }) {
  const { name, album, artists, id } = item.track;
  const { added_at } = item;
  const artistString = artists.map((artist) => artist.name).join(', ');
  return (
    <div className="listing-item">
      <ImagePx images={album?.images} size={64} name={name} />
      {name} by {artistString} ({formatDate(added_at)})
      <a
        href={`https://open.spotify.com/track/${id}`}
        target="_blank"
        rel="noreferrer"
        title={`Open ${name} by ${artistString} in Spotify`}
        aria-description={`open ${name} by ${artistString} in Spotify`}
      >
        <FaSpotify style={{ color: '#1db954' }} />
        {/* [Open in Spotify] */}
      </a>
      <NoteUI trackId={id} addedAt={added_at} />
    </div>
  );
}

export default TrackItem;
