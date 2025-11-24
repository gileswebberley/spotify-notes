import { useEffect } from 'react';
import { getImageURLByHeightSize } from '../utils/helpers';
import ImagePx from './ImagePx';
import ColorThief from 'colorthief';
import HeaderColourSettingImage from './HeaderColourSettingImage';

function PlaylistHeader({ playlist }) {
  const { images, name, tracks } = playlist;
  const totalTracks = tracks.total;

  return (
    <div className="playlist-header">
      <HeaderColourSettingImage images={images} />
    </div>
  );
}

export default PlaylistHeader;
