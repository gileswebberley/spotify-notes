import ImagePlaceholder from './ImagePlaceholder';
//size can be 'sm' (60px) or 'md' (300px) or 'lg' (640px) - default is 'sm'
function ImagePx({ images, name, size = 'sm' }) {
  const pixelSize = size === 'sm' ? 60 : size === 'md' ? 300 : 640;
  const imgUrl = images.find((img) => img.height === pixelSize)?.url;
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
