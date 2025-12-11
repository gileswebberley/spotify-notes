function ImagePlaceholder({ size }) {
  return (
    <div
      className="listing-image listing-image-placeholder"
      width={size}
      height={size}
      alt="No image available"
    ></div>
  );
}

export default ImagePlaceholder;
