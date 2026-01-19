import { useQuery } from '@tanstack/react-query';
import { getCurrentlyPlayingTrack, isLoggedIn } from '../services/apiSpotify';

//I am using this hook via an event (clicking a button) and so I do not want to set the refreshInterval, instead it will remain with the same track so it doesn't automatically change whilst making a note
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
    staleTime: 0,
    // refetchInterval: 5000,
  });

  return { status, fetchStatus, currentlyPlaying, error };
}
