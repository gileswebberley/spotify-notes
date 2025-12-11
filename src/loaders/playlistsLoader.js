import { redirect } from 'react-router-dom';
import { isLoggedIn } from '../services/apiSpotify';
import { AUTH_PATH } from '../utils/constants';

//Now using react-query so it loads the first 20 and caches them, unlike in Playlist (singular) the first call to usePaginatedFetch is the same function so we can do it this way
export async function playlistsLoader() {
  if (!isLoggedIn()) {
    return redirect(AUTH_PATH);
  }
  return null;
}
