import HeaderColourSettingImage from './HeaderColourSettingImage';
import BackButton from './BackButton';

function PlaylistHeader({ playlist }) {
  const { images, name, tracks } = playlist;
  const totalTracks = tracks.total;

  return (
    <div className="playlist-header-colour playlist-header-container">
      {/* <BackButton steps={1} /> */}
      <HeaderColourSettingImage images={images} />
    </div>
  );
}

export default PlaylistHeader;
