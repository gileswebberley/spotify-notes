import { useNavigate } from 'react-router-dom';
import ImagePx from './ImagePx';
import { forwardRef } from 'react';

//forwardRef for use with useIntersection
const PlaylistItem = forwardRef(({ playlist }, ref) => {
  const { name, tracks, images, owner, id } = playlist;
  const navigate = useNavigate();

  function handleClick() {
    console.log(`Clicked playlist with id: ${id}`);
    navigate(`/playlist/${id}`);
  }

  return (
    <div
      className="list-row"
      role="button"
      aria-description={`Click to open the playlist called ${name}`}
      onClick={handleClick}
    >
      <div className="col-title" ref={ref}>
        <ImagePx images={images} size={64} name={name} />
        <div className="ellipsis-text-block">
          <span className="track-name-font">{name}</span>
          <br />
          {owner?.display_name}
        </div>
      </div>
      <div className="col-playlist-added">date</div>
      <div className="col-tracks">{tracks.total}</div>
      {/* <div
        ref={ref}
        className="interactive-listing-item"
        role="button"
        aria-description={`Click to open the playlist called ${name}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        <ImagePx images={images} name={name} />
        {name} by {owner.display_name} ({tracks.total} tracks)
      </div> */}
    </div>
  );
});

export default PlaylistItem;
