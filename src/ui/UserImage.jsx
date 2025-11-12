function UserImage({ images, size = 64 }) {
  if (images.length === 0) {
    return null;
  }

  //grab an image that is big enough for the size requested
  const imgUrl = images.find((img) => img.height >= size)?.url;
  if (!imgUrl) {
    return null;
  }
  return (
    <div className="user-image" style={{ width: size, height: size }}>
      <img loading="lazy" src={imgUrl} />
    </div>
  );
}

export default UserImage;
