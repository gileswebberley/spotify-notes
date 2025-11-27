import { useNavigate } from 'react-router-dom';
import ImagePx from './ImagePx';

function PlaylistItem({ playlist }) {
  const { name, tracks, images, owner, id } = playlist;
  const navigate = useNavigate();

  function handleClick() {
    console.log(`Clicked playlist with id: ${id}`);
    navigate(`/playlist/${id}`);
  }

  return (
    <div
      className="interactive-listing-item"
      role="button"
      aria-description={`Click to open the playlist called ${name}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <ImagePx images={images} name={name} />
      {name} by {owner.display_name} ({tracks.total} tracks)
    </div>
  );
}

export default PlaylistItem;
