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

//So we can work with tanstack-query along with react-router we use a curried function pattern (a function returning another function) so you can inject queryClient at route setup time while still letting React Router pass { params } at navigation time. Because we inject queryClient (in createBrowserRouter we call playlistLoader(queryClient) rather than just setting the loader to playlistLoader) this then returns the inner function as the loader function itself and react-router passes an object {params, request, context} into all loader functions. Because the inner function is a closure it has access to the queryClient variable from the outer function.
export const playlistLoader =
  (queryClient) =>
  async ({ params }) => {
    const isTokenValid = await getAccessToken();
    if (!isLoggedIn() || isTokenValid === false) {
      return redirect(AUTH_PATH);
    }
    const { playlistId } = params;
    let playlist = null;
    //this means that the first 'page' of a playlist will be cached and then the rest of the tracks (outside of the limit spotify enforces) will be cached by the infinite query that is the backbone of the usePaginatedFetch hook
    //fixing the refresh token problem by adding an enabled to query - not possible in fetchQuery! :(
    try {
      playlist = await queryClient.fetchQuery({
        queryKey: ['playlist', playlistId],
        queryFn: () => getUserPlaylist(playlistId),
      });
    } catch (error) {
      if (error?.message?.includes('No access token')) {
        console.error(
          'unautenticated access attempt to playlists, redirecting to AUTH....',
        );
        //need to throw this redirect as returning it from a catch block does not work - no, apparently this is a misconception. If thrown React Router catches the thrown value internally, checks if it is a Response object, recognises the redirect status (302), and immediately navigates to AUTH_PATH. It does not treat it as an error and does not render your errorElement. If returned React Router receives the Response object as the loader's resolved value, recognises the redirect status (302), and immediately navigates to AUTH_PATH, and so useLoaderData() in the Playlist component is never executed. Essentially, unless you want to intercept the redirect in a catch block and do something with it, you should return rather than throw it.
        return redirect(AUTH_PATH);
      }
      // return { playlist: null, playlistId };//NO - this leaves the Playlist component in a broken state, it should throw an error to the errorElement of the route!!
      throw new Error('Failed to fetch playlist:', error);
    }
    // const enabled = !isTokenExpiring();
    return { playlist, playlistId };
  };
