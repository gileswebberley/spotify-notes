import { useQuery } from '@tanstack/react-query';
import { getCurrentlyPlayingTrack, isLoggedIn } from '../services/apiSpotify';

export function useCurrentlyPlaying() {
  let enableCheck = isLoggedIn();
  const {
    status,
    fetchStatus,
    data: currentlyPlaying,
    error,
  } = useQuery({
    queryKey: ['currently_playing'],
    queryFn: () => getCurrentlyPlayingTrack(),
    enabled: enableCheck,
    useErrorBoundary: true,
    // refetchInterval: 5000,
  });

  return { status, fetchStatus, currentlyPlaying, error };
}
