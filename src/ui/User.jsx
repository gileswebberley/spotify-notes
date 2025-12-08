import { useLocation } from 'react-router-dom';
import { useUserContext } from '../contexts/userContext';
import UserImage from './UserImage';
import { AUTH_PATH } from '../utils/constants';
import { useState } from 'react';

function User() {
  //having quickly implemented this I think I might want to refactor it to put this in a context provider so that it is available to all components because we'll save notes under the user id later on
  //I'm going to make it into an expanding lozenge menu
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const { isLoadingUser, getUserFirstName, getUserImages } = useUserContext();
  const location = useLocation();
  const path = location.path;
  //a little lock to make sure it doesn't try to get user info before it's available
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
      <UserImage images={images} size={50} style={{ cursor: 'pointer' }} />
      Hi {getUserFirstName()}
    </div>
  );
}

export default User;
