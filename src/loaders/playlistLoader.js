//need to change this for the use of tanstack query - I'm trying to get it so I can prefetch as I use a different api function for the tracks
// export async function loader({ params }) {
//   if (!isLoggedIn()) {
//     return redirect(AUTH_PATH);
//   }
//   const { playlistId } = params;
//   const playlist = await getUserPlaylist(playlistId);
//   return { playlist, playlistId };
//   //fetch playlist details from spotify api using the playlistId
// }

import { redirect } from 'react-router-dom';
import {
  getAccessToken,
  getUserPlaylist,
  isLoggedIn,
} from '../services/apiSpotify';
import { AUTH_PATH } from '../utils/constants';

export const playlistLoader =
  (queryClient) =>
  async ({ params }) => {
    if (!isLoggedIn()) {
      return redirect(AUTH_PATH);
    }
    const { playlistId } = params;
    let playlist = null;
    //this means that the first 'page' of a playlist will be cached and then the rest of the tracks (outside of the limit spotify enforces) will be cached by the infinite query that is the backbone of the usePaginatedFetch hook
    //fixing the refresh token problem by adding an enabled to query - not possible in fetchQuery! :(
    try {
      await getAccessToken();
      playlist = await queryClient.fetchQuery({
        queryKey: ['playlist', playlistId],
        queryFn: () => getUserPlaylist(playlistId),
      });
    } catch (error) {
      console.error('Failed to prefetch playlist:', error);
      return { playlist: null, playlistId };
    }
    // const enabled = !isTokenExpiring();
    return { playlist, playlistId };
  };
