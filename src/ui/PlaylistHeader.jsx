import { useEffect } from 'react';
import { getImageURLByHeightSize } from '../utils/helpers';
import ImagePx from './ImagePx';
import ColorThief from 'colorthief';

function PlaylistHeader({ playlist }) {
  const { images, name, tracks } = playlist;
  const totalTracks = tracks.total;
  //trying to get the colour based on the image for the header like on spotify
  const imgUrl = getImageURLByHeightSize(images, 250);

  useEffect(() => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imgUrl;
    const colourThief = new ColorThief();
    const listener = image.addEventListener('load', function () {
      const averageColour = colourThief.getColor(image);
      document.documentElement.style.setProperty(
        '--playlist-header-colour',
        `rgb(${averageColour})`
      );
      console.log(`The colour of the playlist image is ${averageColour}`);
    });
    return () => image.removeEventListener('load', listener);
  }, [imgUrl]);

  return (
    <div className="playlist-header">
      <img src={imgUrl} />
    </div>
  );
}

export default PlaylistHeader;
