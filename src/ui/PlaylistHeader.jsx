import HeaderColourSettingImage from './HeaderColourSettingImage';
import BackButton from './BackButton';
import PlaylistHeaderInfo from './PlaylistHeaderInfo';

function PlaylistHeader({ playlist }) {
  const { images, name, tracks, owner } = playlist;
  const totalTracks = tracks.total;

  return (
    <div className="playlist-header-colour playlist-header-container">
      {/* <BackButton steps={1} /> */}
      <div className="playlist-header-layout">
        <HeaderColourSettingImage images={images} />
        <PlaylistHeaderInfo name={name} tracks={totalTracks} owner={owner} />
      </div>
    </div>
  );
}

export default PlaylistHeader;
