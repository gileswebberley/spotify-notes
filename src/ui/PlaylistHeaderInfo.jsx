import { LuDot } from 'react-icons/lu';
import { useUser } from '../query-hooks/useUser';
import UserImage from './UserImage';

function PlaylistHeaderInfo({ name, tracks, owner }) {
  const { status, fetchStatus, user, error } = useUser(owner?.id);
  const { display_name, images } = user ?? {};

  return (
    <section className="playlist-header-info">
      <h2>{name}</h2>
      <article className="playlist-header-user">
        {status === 'pending' ? (
          'loading...'
        ) : status === 'error' ? (
          '-'
        ) : (
          <>
            <UserImage images={images} size={20} />{' '}
            <h3>
              {display_name}
              <LuDot
                style={{
                  transform: 'translateY(3px)',
                }}
              />
            </h3>
          </>
        )}
        <p>{tracks} songs</p>
      </article>
    </section>
  );
}

export default PlaylistHeaderInfo;
