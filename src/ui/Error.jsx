import { NavLink, useRouteError } from 'react-router-dom';

function Error() {
  //   const navigate = useNavigate();
  //here we can grab the error object itself so that we can show a message
  const err = useRouteError();

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{err.message || err.data}</p>
      <NavLink to="-1">&larr; Go back</NavLink>
    </div>
  );
}

export default Error;
