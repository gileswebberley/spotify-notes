//I've added the rest operator so that we can pass in extra arguments if needed, such as an id for using it with the playlist tracks functionality
//Asked copilot for suggestion on making this use react-query infinite scroll -------

import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { isLoggedIn, isTokenExpiring } from '../services/apiSpotify';

// fetchFunction(pageOffset, limit, ...args) => returns a Spotify page object { items, next, previous, limit, offset, ... }
// initialState is the first-page object (from your loader)
/**
 * @template T
 * @typedef {Object} SpotifyPage
 * @property {string} href - A link to the Web API endpoint returning the full result of the request.
 * @property {T[]} items - The requested data items.
 * @property {number} limit - The maximum number of items in the response (as set in the query or by default).
 * @property {string | null} next - URL to the next page of items, or null if none.
 * @property {number} offset - The offset of the items returned (as set in the query or by default).
 * @property {string | null} previous - URL to the previous page of items, or null if none.
 * @property {number} total - The total number of items available to return.
 * /
 /**
 * @typedef {Object} RawPageObject
 * @property {number} offset - The index of the first item in the Page object relative to the entire collection of items
 * @property {number} limit - The maximum number of items in the Page object ( namely items from offset to offset + limit) 
 */
/**
 * A function that fetches a page of data from the Spotify API, which can optionally take additional arguments as an array
 *
 * @template T
 * @template {any[]} [TArgs=any[]]
 * @callback FetchingFunction
 * @param {number} offset - The offset for pagination.
 * @param {number} limit - The number of items to fetch.
 * @param {TArgs} [args] - Array of additional arguments passed from usePaginatedFetch.
 * @returns {Promise<SpotifyPage<T>>} - A promise that resolves to a Spotify page object.
 */
/**
 * @template T
 * @typedef {Object} UsePaginatedFetchResult
 * @property {SpotifyPage<T> | undefined} data - Merged page object containing flattened items across all loaded pages.
 * @property {(direction: number) => Promise<void>} getNextPrev - Fetches the next page when direction > 0, or the previous page when direction < 0.
 * @property {boolean} hasNext - Whether a next page is available to fetch.
 * @property {boolean} hasPrevious - Whether a previous page is available to fetch.
 * @property {boolean} isLoading - True during the initial load or any subsequent page fetch.
 * @property {import('@tanstack/react-query').UseInfiniteQueryResult['refetch']} refetch - Function to manually refetch all loaded pages.
 */
/**
 * Custom hook that implements paginated fetching using tanstack-query's useInfiniteQuery. It works alongside the useIntersection custom hook to enable infinite scrolling functionality. This is not for use with cursor pagination!!
 *
 * @template T
 * @template {any[]} [TArgs=any[]]
 * @param {FetchingFunction} fetchFunction - The api calling function, for example getUserPlaylists or getPlaylistTracks
 * @param {SpotifyPage | RawPageObject | null} initialState - offset defaults to 0, limit defaults to 20
 * @param {...TArgs} args - Additional arguments passed through to the fetchFunction, for example for Playlist tracks we pass in the playlistId
 * @returns {UsePaginatedFetchResult<T>} - An object containing the merged data (which has an items property that contains all of the pages items for example all the track objects in a playlist), pagination functions, and loading state.
 */
export function usePaginatedFetch(fetchFunction, initialState, ...args) {
  const initialOffset = Number(initialState?.offset ?? 0);
  const limit = Number(initialState?.limit ?? 20);
  // when args is the playlistId for example this makes the query key unique to that playlist so that the infinite query is cached separately for each playlist
  const queryKey = [fetchFunction.name || 'paginated', ...args];

  let enabledCheck = isLoggedIn();
  // try {
  //   enabledCheck = !isTokenExpiring();
  // } catch (error) {
  //   enabledCheck = false;
  // }

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = initialOffset }) =>
      fetchFunction(Number(pageParam), limit, args),
    getNextPageParam: (lastPage) => {
      const nextUrl = lastPage?.next;
      if (!nextUrl) return undefined;
      const next = new URL(nextUrl).searchParams.get('offset');
      return next ? Number(next) : undefined;
    },
    getPreviousPageParam: (firstPage) => {
      const prevUrl = firstPage?.previous;
      if (!prevUrl) return undefined;
      const prev = new URL(prevUrl).searchParams.get('offset');
      return prev ? Number(prev) : undefined;
    },
    initialData: initialState
      ? { pages: [initialState], pageParams: [initialOffset] }
      : undefined,
    keepPreviousData: true,
    enabled: enabledCheck,
    useErrorBoundary: true,
  });

  // when the query data changes this creates the object that is returned as data from this hook. It essentially extracts all of the items from the Spotify page objects and creates the array that we can map over in the component (for example the tracks in a playlist). If we've started with eg offset 20 and limit 20 then first will have a previous property and obviously last will have a next property until we reach the end of the collection.
  const merged = useMemo(() => {
    if (!query.data) return initialState;
    const pages = query.data.pages;
    const items = pages.flatMap((p) => p.items || []);
    const first = pages[0] || {};
    const last = pages[pages.length - 1] || {};
    return {
      ...first,
      items,
      next: last.next,
      previous: first.previous,
      limit,
      offset: Number(last.offset ?? first.offset ?? 0),
    };
  }, [query.data, initialState, limit]);

  const getNextPrev = async (direction) => {
    if (direction > 0 && query.hasNextPage) {
      await query.fetchNextPage();
    } else if (direction < 0 && query.hasPreviousPage) {
      await query.fetchPreviousPage();
    }
  };

  return {
    data: merged,
    getNextPrev,
    hasNext: Boolean(query.hasNextPage),
    hasPrevious: Boolean(query.hasPreviousPage),
    isLoading: query.isLoading || query.isFetching,
    refetch: query.refetch,
  };
}
