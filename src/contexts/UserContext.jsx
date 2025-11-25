import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '../services/apiSpotify';
import { useLocation, useNavigation } from 'react-router-dom';
import { AUTH_PATH } from '../utils/constants';

const UserContext = createContext(null);

function UserContextProvider({ children }) {
  const [userProfile, setUserProfile] = useState(null);
  //we don't want to try to get the user whilst we're logging in which happens at the root path (Home)
  const location = useLocation();
  const path = location.pathname;
  const navigation = useNavigation();
  const isLoadingUser = navigation.state === 'loading' || !userProfile;

  useEffect(() => {
    async function fetchUserProfile() {
      console.log('fetching user profile....');
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    if (!userProfile && path !== AUTH_PATH) fetchUserProfile();
  }, [userProfile, path]);

  function getUserFirstName() {
    return getUserDisplayName().split(' ')[0] ?? 'Anon';
  }

  function getUserDisplayName() {
    return userProfile?.display_name ?? 'Anon';
  }

  function getUserCountry() {
    return userProfile?.country ?? 'Unknown';
  }

  function getUserId() {
    let id;
    id = userProfile?.id;
    if (!id) {
      throw new Error('User ID is not available');
    }
    return id;
  }
  //returns an array of user images or an empty array if none are available
  function getUserImages() {
    return userProfile?.images ?? [];
  }

  //returns the Spotify URI of the user - described as "The resource identifier of, for example, an artist, album or track. This can be entered in the search box in a Spotify Desktop Client, to navigate to that resource. To find a Spotify URI, right-click (on Windows) or Ctrl-Click (on a Mac) on the artist, album or track name. Example: spotify:track:6rqhFgbbKwnb9MLmUQDhG6"
  function getUserURI() {
    return userProfile?.uri ?? '';
  }

  return (
    <UserContext.Provider
      value={{
        getUserFirstName,
        getUserDisplayName,
        getUserCountry,
        getUserId,
        getUserImages,
        getUserURI,
        isLoadingUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}

export { useUserContext, UserContextProvider };
