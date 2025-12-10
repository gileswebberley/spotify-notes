import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  return (
    <div>
      Welcome to Snotify{' '}
      <button onClick={() => navigate('/auth')}>Log in to spotify</button>
    </div>
  );
}

export default Landing;
