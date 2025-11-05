import ImagePx from './ImagePx';

function PlaylistItem({ playlist }) {
  const { name, tracks, images } = playlist;
  return (
    <div>
      <ImagePx images={images} name={name} size="sm" />
      {name} ({tracks.total} tracks)
    </div>
  );
}

export default PlaylistItem;
