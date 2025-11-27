import { useLocation } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import UserImage from './UserImage';
import { AUTH_PATH } from '../utils/constants';

function User() {
  //having quickly implemented this I think I might want to refactor it to put this in a context provider so that it is available to all components because we'll save notes under the user id later on
  const { isLoadingUser, getUserFirstName, getUserImages } = useUserContext();
  const location = useLocation();
  const path = location.path;
  if (path === AUTH_PATH || path === '/') {
    return null;
  }

  if (isLoadingUser) {
    return <div>Loading user profile...</div>;
  }
  const images = getUserImages();
  // console.table('User images:', images);

  return (
    <div>
      <UserImage images={images} size={50} />
      Hi {getUserFirstName()}
    </div>
  );
}

export default User;
