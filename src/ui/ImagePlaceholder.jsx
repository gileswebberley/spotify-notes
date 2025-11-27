function ImagePlaceholder({ size }) {
  return (
    <div
      className="listing-image listing-image-placeholder"
      // style={{
      //   width: size,
      //   height: size,
      //   backgroundColor: '#dddddd',
      //   borderRadius: 10,
      //   display: 'inline-block',
      // }}
      width={size}
      height={size}
      alt="No image available"
    ></div>
  );
}

export default ImagePlaceholder;
