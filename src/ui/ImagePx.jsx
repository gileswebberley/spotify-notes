import { getImageURLByHeightSize } from '../utils/helpers';
import ImagePlaceholder from './ImagePlaceholder';
//size
/**
 * @typedef (Object) Props
 * @property {Array<String>} images - the array of images to check for a suitable sized image (must be as big or bigger than desired size)
 * @property {String} name - for use in the alt property
 * @property {String | Number} size - default = 'sm', can be a number of pixels or 'sm' (60px) or 'md' (300px) or 'lg' (640px) - default is 'md'
 * @property {Boolean} showPlaceholder - default = true, whether to return a placeholder or simply null
 *
 * @param {Props} props
 * @returns
 */
function ImagePx({ images, name, showPlaceholder = true, size = 'md' }) {
  let pixelSize;
  if (typeof size !== 'number') {
    pixelSize = size === 'sm' ? 60 : size === 'md' ? 300 : 640;
  } else {
    pixelSize = size;
  }
  const imgUrl = getImageURLByHeightSize(images, pixelSize);
  //set the width and height properties on the img tag so that it avoids layout shifts whilst loading
  return (
    <>
      {imgUrl ? (
        <img
          className="listing-image"
          width={pixelSize}
          height={pixelSize}
          loading="lazy"
          src={imgUrl}
          alt={`image for ${name}`}
        />
      ) : showPlaceholder ? (
        <ImagePlaceholder size={pixelSize} />
      ) : null}
    </>
  );
}

export default ImagePx;
