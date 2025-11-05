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
    ></div>
  );
}

export default ImagePlaceholder;
