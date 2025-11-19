import { formatDate } from '../utils/helpers';
import ImagePx from './ImagePx';
import NoteUI from './NoteUI';

function TrackItem({ item }) {
  const { name, album, artists, id } = item.track;
  const { added_at } = item;
  return (
    <div>
      <ImagePx images={album?.images} size={64} name={name} />
      {name} by {artists.map((artist) => artist.name).join(', ')} (
      {formatDate(added_at)})
      <a
        href={`https://open.spotify.com/track/${id}`}
        target="_blank"
        rel="noreferrer"
      >
        [Open in Spotify]
      </a>
      <NoteUI trackId={id} addedAt={added_at} />
    </div>
  );
}

export default TrackItem;
