import { useUser } from '../query-hooks/useUser';
import UserImage from './UserImage';

function PlaylistHeaderInfo({ name, tracks, owner }) {
  const { status, fetchStatus, user, error } = useUser(owner?.id);
  const { display_name, images } = user ?? {};

  return (
    <div className="playlist-header-info">
      <h2>{name}</h2>
      <div className="playlist-header-user">
        {status === 'pending' ? (
          'loading...'
        ) : status === 'error' ? (
          '-'
        ) : (
          <>
            <UserImage images={images} size={20} /> <h3>{display_name}</h3>
          </>
        )}
        <p>{tracks} songs</p>
      </div>
    </div>
  );
}

export default PlaylistHeaderInfo;
