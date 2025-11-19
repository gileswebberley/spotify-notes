function ImagePlaceholder({ size }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: '#dddddd',
        borderRadius: 10,
        display: 'inline-block',
      }}
      alt="No image available"
    ></div>
  );
}

export default ImagePlaceholder;
