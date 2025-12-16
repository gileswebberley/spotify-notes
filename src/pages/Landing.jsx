import { useNavigate } from 'react-router-dom';
import OverlayScrollContainer from '../ui/OverlayScrollContainer';
import { useEffect, useState } from 'react';

function Landing() {
  const navigate = useNavigate();
  //now we've tried to make this a pwa I'm going to change the header according to network status and simply serve this as the navigateFallback in vite.config.js (or more to the point serve index.html whether online ot offline and block other routes when offline)
  const [networkAvailable, setNetworkAvailable] = useState(navigator.onLine);
  console.log(`is networkAvailable: ${networkAvailable}`);
  //little helper functions for adding/removing eventListeners
  const setOnline = () => setNetworkAvailable(true);
  const setOffline = () => setNetworkAvailable(false);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return (
    <div className="app-layout">
      <header style={{ height: 'auto', textAlign: 'right' }}>
        {networkAvailable ? (
          <>
            <h2 style={{ marginTop: '0.8dvh' }}>Let's Get You Started...</h2>
            <button onClick={() => navigate('/auth')}>Login To Spotify</button>
          </>
        ) : (
          <>
            <h2 style={{ marginTop: '0.8dvh' }}>You Are Offline</h2>
            <button disabled={true}>Login To Spotify</button>
          </>
        )}
      </header>
      {/* <main className="landing-content"> */}
      <OverlayScrollContainer className={'landing-content'}>
        <div className="landing-ident">
          <img src="./logo600.png" className="landing-logo" />
          <h1 className="name">Snotify</h1>
        </div>
        <h2>
          Welcome to my pet project which gives you the ability to connect notes
          with tracks that you have on your Spotify playlists.
        </h2>
        <p>
          I should mention that it's pronounced S-notify btw, it's not anything
          with being bunged up :|)
        </p>
        <div className="demo-section">
          <img src="./adding_a_note_snotify.jpg" />
          <span>
            <h2>
              A little introduction before you get stuck into using Snotify
            </h2>
            <p>
              I've been wanting to make notes to go with my Spotify tracks for
              some time now, I even submitted it as a suggestion on their
              developers website years ago. Given that they paid it no heed I
              decided to use it as an idea for my front-end development
              portfolio and look forward to developing it further.
            </p>
            <p>
              <br />
              Currently Snotify allows you to log in with your Spotify account,
              view your playlists and add notes to tracks within those
              playlists. You can then view and edit those notes as you wish,
              although keep in mind that they will only be available in the
              browser that you used to add them.
            </p>
          </span>
        </div>
        <p style={{ fontStyle: 'italic' }}>
          Snotify currently uses some storage available in your browser to keep
          your notes and tie them to the tracks.
          <br />
          Notes will follow a track so even if they appear in several playlists
          they will only have one note.
          <br />
          In terms of the amount of storage space Snotify will take up for your
          notes - 1000 notes will only use approximately 1MB, which is tiny in
          modern terms.
          <br />
          If you have any problems or suggestions please do get in touch via
          email - gileswebberley@gmail.com
        </p>
        <h2>I hope you enjoy</h2>
      </OverlayScrollContainer>
      {/* </main> */}
    </div>
  );
}

export default Landing;
