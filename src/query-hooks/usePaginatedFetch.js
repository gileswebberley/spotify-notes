//I've added the rest operator so that we can pass in extra arguments if needed, such as an id for using it with the playlist tracks functionality
//Asked copilot for suggestion on making this use react-query infinite scroll -------

import { useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { isLoggedIn, isTokenExpiring } from '../services/apiSpotify';

// fetchFunction(pageOffset, limit, ...args) => returns a Spotify page object { items, next, previous, limit, offset, ... }
// initialState is the first-page object (from your loader)
export function usePaginatedFetch(fetchFunction, initialState, ...args) {
  const initialOffset = Number(initialState?.offset ?? 0);
  const limit = Number(initialState?.limit ?? 20);
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
