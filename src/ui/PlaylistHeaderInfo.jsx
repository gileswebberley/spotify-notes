import { LuDot } from 'react-icons/lu';
import { useUser } from '../query-hooks/useUser';
import UserImage from './UserImage';
import { useState } from 'react';

function PlaylistHeaderInfo({ name, tracks, owner }) {
  const { status, fetchStatus, user, error } = useUser(owner?.id);
  const { display_name, images } = user ?? {};
  const [clampName, setClampName] = useState(true);

  return (
    <section className="playlist-header-info">
      <div className="clamp-wrapper">
        <h2
          className={clampName ? 'clamped' : ''}
          onClick={() => setClampName(!clampName)}
        >
          {name}
        </h2>
      </div>
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
