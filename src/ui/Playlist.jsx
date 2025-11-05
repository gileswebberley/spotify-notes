function Playlist({ playlist }) {
  const { name, tracks, images } = playlist;
  return (
    <div>
      {name} ({tracks.total} tracks)
    </div>
  );
}

export default Playlist;
