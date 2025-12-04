import { useQuery } from '@tanstack/react-query';
import { getUserProfile, isTokenExpiring } from '../services/apiSpotify';

export function useUser(id = null) {
  const userKey = id === null ? 'me' : id;
  let enableCheck;
  try {
    enableCheck = !isTokenExpiring();
  } catch (error) {
    enableCheck = false;
  }
  const {
    status,
    fetchStatus,
    data: user,
    error,
  } = useQuery({
    queryKey: ['user', userKey],
    queryFn: () => getUserProfile(id),
    enabled: enableCheck,
  });

  return { status, fetchStatus, user, error };
}
