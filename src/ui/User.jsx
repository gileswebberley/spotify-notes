// import { use } from 'react';
// import { useEffect, useState } from 'react';
// import { getUserProfile } from '../services/apiSpotify';
// import { useNavigation } from 'react-router-dom';

import { useUserContext } from '../contexts/UserContext';

function User() {
  //having quickly implemented this I think I might want to refactor it to put this in a context provider so that it is available to all components
  //   const [userProfile, setUserProfile] = useState(null);

  //   useEffect(() => {
  //     async function fetchUserProfile() {
  //       try {
  //         const profile = await getUserProfile();
  //         setUserProfile(profile);
  //       } catch (error) {
  //         console.error('Error fetching user profile:', error);
  //       }
  //     }
  //     if (!userProfile) fetchUserProfile();
  //   }, [userProfile]);
  //   const navigation = useNavigation();
  //   const isLoading = navigation.state === 'loading' || !userProfile;
  const { isLoadingUser, getUserFirstName } = useUserContext();

  if (isLoadingUser) {
    return <div>Loading user profile...</div>;
  }

  return <div>Hi {getUserFirstName()}</div>;
}

export default User;
