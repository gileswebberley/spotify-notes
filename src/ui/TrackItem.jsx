import ImagePx from './ImagePx';

function TrackItem({ track }) {
  const { name, album, artists, id } = track;
  return (
    <div>
      <ImagePx images={album?.images} size={64} name={name} />
      {name} by {artists.map((artist) => artist.name).join(', ')}
    </div>
  );
}

export default TrackItem;
