import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  return (
    <div className="app-layout">
      <header style={{ height: 'auto', textAlign: 'right' }}>
        <h2 style={{ marginTop: '0.8dvh' }}>Let's Get You Started...</h2>
        <button onClick={() => navigate('/auth')}>Log in to spotify</button>
      </header>
      <main className="landing-content">
        <div className="landing-ident">
          <img src="./logo600.png" className="landing-logo" />
          <h1 className="name">Snotify</h1>
        </div>
        <h2 style={{ textAlign: 'center' }}>
          Welcome to my pet project to allow the ability to connect notes with
          tracks that you have on your Spotify playlists.
        </h2>
        <p style={{ textAlign: 'center' }}>
          I should mention that it's pronounced S-notify btw, it's nothing to do
          with being bunged up :|)
        </p>
        <div className="demo-section"></div>
      </main>
    </div>
  );
}

export default Landing;
