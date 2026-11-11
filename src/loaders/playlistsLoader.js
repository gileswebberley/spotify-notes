import { redirect } from 'react-router-dom';
import { getAccessToken, isLoggedIn } from '../services/apiSpotify';
import { AUTH_PATH } from '../utils/constants';

//Now using react-query so it loads the first 20 and caches them, unlike in Playlist (singular) the first call to usePaginatedFetch is the same function so we can do it this way
export async function playlistsLoader() {
  try {
    // console.log(
    //   'Playlists loader has executed and will check the access token...',
    // );
    const validToken = await getAccessToken();
    // console.log(
    //   `Playlists loader has received a validToken value of ${validToken}`,
    // );
    if (!isLoggedIn() || validToken === false) {
      return redirect(AUTH_PATH);
    }
    return null;
  } catch (error) {
    throw new Error(
      `An error has been caused by checking if you're still logged in: ${error}`,
    );
  }
}
