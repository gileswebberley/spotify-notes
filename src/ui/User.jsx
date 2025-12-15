import { useLocation } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import UserImage from './UserImage';
import { AUTH_PATH } from '../utils/constants';
import { useState } from 'react';
import { deleteAllNotesForUser } from '../services/DexieDB';
import { logoutUser } from '../services/apiSpotify';

function User() {
  //having quickly implemented this I think I might want to refactor it to put this in a context provider so that it is available to all components because we'll save notes under the user id later on
  //I'm going to make it into an expanding lozenge menu
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const { isLoadingUser, getUserFirstName, getUserImages, getUserId } =
    useUserContext();

  const [isBusy, setisBusy] = useState(false);

  //Making a really verbose confirmation message so this isn't done by accident!
  async function handleDeleteAllNotes(event) {
    setisBusy(true);
    if (
      window.confirm(
        `Are you sure you want to delete all of your notes ${getUserFirstName()}? THIS ACTION CANNOT BE UNDONE AND WILL DELETE ALL OF YOUR NOTES, PERMANENTLY!`
      )
    ) {
      const userId = getUserId();
      try {
        const deletedCount = await deleteAllNotesForUser(userId);
        if (deletedCount) {
          // console.log('Note deleted');
          window.alert(
            `All ${deletedCount} of your notes have been deleted ${getUserFirstName()}`
          );
        } else {
          console.log('No note to delete');
        }
      } catch (e) {
        window.alert('Failed to delete your notes:', e);
        // throw e;
      } finally {
        setisBusy(false);
      }
    } else {
      setisBusy(false);
      //remove focus from button when deleting is cancelled
      event.target.blur();
    }
  }

  function handleLogOut(event) {
    setisBusy(true);
    if (
      window.confirm(`Are you sure you wish to log out ${getUserFirstName()}?`)
    ) {
      logoutUser();
      setisBusy(false);
      window.location.replace('/');
    } else {
      setisBusy(false);
      event.target.blur();
    }
  }

  const location = useLocation();
  const path = location.path;
  //a little lock to make sure it doesn't try to get user info before it's available, placed here as all hooks need to be at the top level (ie without conditionals)
  if (path === AUTH_PATH || path === '/') {
    return null;
  }

  if (isLoadingUser) {
    return <div>Loading user profile...</div>;
  }

  const images = getUserImages();
  // console.table('User images:', images);

  return (
    <div
      className={`user-button-menu ${isExpanded ? 'is-expanded' : ''}`}
      onClick={toggleExpanded}
      aria-description="click to open user menu"
    >
      <span className="main-user-toggle ">
        <UserImage images={images} size={50} style={{ cursor: 'pointer' }} />
      </span>
      {/* {!isExpanded && `Hi ${getUserFirstName()}`} */}
      <div className="user-sub-buttons">
        <button
          className="user-sub-btn"
          disabled={isBusy}
          onClick={handleLogOut}
        >
          Log Out
        </button>
        <button
          className="user-sub-btn"
          disabled={isBusy}
          onClick={handleDeleteAllNotes}
        >
          Delete All Notes
        </button>
      </div>
    </div>
  );
}

export default User;
