import ImagePlaceholder from './ImagePlaceholder';
//size can be a number or 'sm' (60px) or 'md' (300px) or 'lg' (640px) - default is 'sm'
function ImagePx({ images, name, size = 'sm' }) {
  let pixelSize;
  if (typeof size !== 'number') {
    pixelSize = size === 'sm' ? 60 : size === 'md' ? 300 : 640;
  } else {
    pixelSize = size;
  }
  images.sort((a, b) => a.height - b.height);
  const imgUrl = images?.find((img) => img.height >= pixelSize)?.url;
  //set the width and height properties on the img tag so that it avoids layout shifts whilst loading
  return (
    <>
      {imgUrl ? (
        <img
          width={pixelSize}
          height={pixelSize}
          loading="lazy"
          src={imgUrl}
          alt={`image for ${name}`}
        />
      ) : (
        <ImagePlaceholder size={pixelSize} />
      )}
    </>
  );
}

export default ImagePx;
