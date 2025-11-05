// import { use } from 'react';
import { useEffect, useState } from 'react';
import { getUserProfile } from '../services/apiSpotify';
import { useNavigation } from 'react-router-dom';

function User() {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    if (!userProfile) fetchUserProfile();
  }, [userProfile]);
  const navigation = useNavigation();

  if (navigation.state === 'loading') {
    return <div>Loading user profile...</div>;
  }

  return <div>Hi {userProfile?.display_name.split(' ')[0] ?? '...'}</div>;
}

export default User;
