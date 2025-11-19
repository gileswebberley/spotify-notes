function UserImage({ images, size = 64 }) {
  if (images.length === 0) {
    return null;
  }
  //have to sort the images so that the smallest comes first as find() will return the first that matches which at the mpoment is the largest (remember that sort is a mutating function so it sorts the array itself rather than creating and returning a new one)
  images.sort((a, b) => a.height - b.height);
  //grab an image that is big enough for the size requested
  const imgUrl = images.find((img) => img.height >= size)?.url;
  if (!imgUrl) {
    return null;
  }
  return (
    <div className="user-image" style={{ width: size, height: size }}>
      <img
        loading="lazy"
        src={imgUrl}
        alt="user image"
        width={size}
        height={size}
      />
    </div>
  );
}

export default UserImage;
