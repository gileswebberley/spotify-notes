import HeaderColourSettingImage from './HeaderColourSettingImage';
import PlaylistHeaderInfo from './PlaylistHeaderInfo';

function PlaylistHeader({ playlist }) {
  const { images, name, tracks, owner } = playlist;
  const totalTracks = tracks.total;

  return (
    <div className="playlist-header-colour playlist-header-container">
      <div className="playlist-header-layout">
        <HeaderColourSettingImage images={images} />
        <PlaylistHeaderInfo name={name} tracks={totalTracks} owner={owner} />
      </div>
    </div>
  );
}

export default PlaylistHeader;
