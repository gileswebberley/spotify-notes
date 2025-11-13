import { useState } from 'react';
//I've added the rest operator so that we can pass in extra arguments if needed, such as an id for using it with the playlist tracks functionality
export function usePaginatedFetch(fetchFunction, initialState, ...args) {
  const [data, setData] = useState(initialState);

  let hasNext = data?.next;
  if (hasNext) {
    hasNext = new URL(hasNext);
  }
  let hasPrevious = data?.previous;
  if (hasPrevious) {
    hasPrevious = new URL(hasPrevious);
  }
  //let's do direction as a positive number for next and negative for previous
  const getNextPrev = async (direction) => {
    if (hasNext && direction > 0) {
      const offset = hasNext.searchParams.get('offset') || 0;
      const limit = hasNext.searchParams.get('limit') || 50;
      await fetchFunction(offset, limit, args).then((data) => {
        setData(data);
      });
    }
    if (hasPrevious && direction < 0) {
      const offset = hasPrevious.searchParams.get('offset') || 0;
      const limit = hasPrevious.searchParams.get('limit') || 50;
      await fetchFunction(offset, limit, args).then((data) => {
        setData(data);
      });
    }
  };
  return { data, getNextPrev, hasNext, hasPrevious };
}
