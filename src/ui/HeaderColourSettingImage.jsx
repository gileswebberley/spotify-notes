import ColorThief from 'colorthief';
import { getImageURLByHeightSize } from '../utils/helpers';
import { useEffect } from 'react';
import ImagePlaceholder from './ImagePlaceholder';

function HeaderColourSettingImage({ images, size = 125 }) {
  //trying to get the colour based on the image for the header like on spotify, using the color thief npm package
  const imgUrl = getImageURLByHeightSize(images, size);
  //this is used as the threshold for making the colour darker
  const brightnessThreshold = 127;
  //how many of the discovered pallette colours will be used to calculate the average
  const sampleSize = 3;

  useEffect(() => {
    let listener = null;
    let image = null;
    if (imgUrl) {
      image = new Image();
      //needed for colorthief to work as it passes it to a canvas I think
      image.crossOrigin = 'Anonymous';
      image.src = imgUrl;
      const colourThief = new ColorThief();
      listener = image.addEventListener('load', function () {
        const dominantColour = colourThief.getColor(image);
        console.log(`Dominant colour is ${dominantColour}`);
        const pallette = colourThief.getPalette(image);
        console.table(`Pallette of colours is`, pallette);
        //so, I'm using the threshold so that I can only pick the dominant colour channels to add to the overall colour as an atempt to get the more primary feel of spotify...hasn't really worked but is producing reasonable colours
        let mixColour = pallette.reduce(
          (acc, colour, index) => {
            if (index > sampleSize - 1) return acc;
            const r =
              acc[0] + (colour[0] > brightnessThreshold ? colour[0] : 0);
            const g =
              acc[1] + (colour[1] > brightnessThreshold ? colour[1] : 0);
            const b =
              acc[2] + (colour[2] > brightnessThreshold ? colour[2] : 0);
            return [r, g, b];
          },
          [0, 0, 0]
        );
        mixColour = mixColour.map((channel) => {
          return Math.floor(channel / sampleSize);
        });
        // const brightness = mixColour.reduce((acc, channel) => acc + channel, 0);
        // if (brightness > brightnessThreshold * 3) {
        //   mixColour = mixColour.map((channel) => {
        //     return Math.floor(channel / 2);
        //   });
        // }
        console.log(`mixColour: ${mixColour}`);
        document.documentElement.style.setProperty(
          '--playlist-header-colour',
          `rgba(${mixColour}, 100)`
        );
      });
    }

    return () => {
      //first reset the colour to avoid the flash when swapping between playlists
      const defaultColour = document.documentElement.style.getPropertyValue(
        '--default-playlist-header-colour'
      );
      document.documentElement.style.setProperty(
        '--playlist-header-colour',
        defaultColour
      );
      //then if we've done the whole color thief thing then remove the listener
      if (listener) return image.removeEventListener('load', listener);
    };
  }, [imgUrl]);
  return imgUrl ? (
    <img width={size} height={size} src={imgUrl} />
  ) : (
    <ImagePlaceholder size={size} />
  );
}

export default HeaderColourSettingImage;
