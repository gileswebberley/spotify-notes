import { useNavigate, useRouteError } from 'react-router-dom';
import Header from './Header';

function Error() {
  const navigate = useNavigate();
  //here we can grab the error object itself so that we can show a message
  const err = useRouteError();

  return (
    // <div className="app-layout">
    //   <Header />
    <div className="error-content">
      <h1>
        We're very sorry but something went wrong
        <br />
        You can try to Go Back to see if it resolves or you might need to Reset
        App which will take you back to Home
      </h1>
      <h2>{err.message || err.data}</h2>
      <button onClick={() => navigate(-1)}>&larr; Go Back</button>
      <button onClick={() => navigate('/')}>Reset App</button>
    </div>
    // </div>
  );
}

export default Error;
