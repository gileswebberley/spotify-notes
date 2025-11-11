import ImagePx from './ImagePx';

function PlaylistItem({ playlist }) {
  const { name, tracks, images, owner } = playlist;
  return (
    <div>
      <ImagePx images={images} name={name} size="sm" />
      {name} by {owner.display_name} ({tracks.total} tracks)
    </div>
  );
}

export default PlaylistItem;
