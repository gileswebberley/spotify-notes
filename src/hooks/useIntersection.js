import { useCallback, useEffect, useRef } from 'react';

export function useIntersection(callbackFn, singleUse = true) {
  const intersectionTargetRef = useRef(null);
  const viewportElementRef = useRef(null);
  //   const observerRef = useRef(null);

  const observerCallback = useCallback(
    (entries, observer) => {
      const target = entries[0];
      if (target.isIntersecting) {
        callbackFn(target);
        if (singleUse) {
          observer.unobserve(target.target);
        }
      }
    },
    [callbackFn, singleUse]
  );

  useEffect(() => {
    let observer;
    const intersectionTarget = intersectionTargetRef?.current;
    if (intersectionTarget) {
      const options = {
        root: viewportElementRef?.current,
        rootMargin: '0px',
        scrollMargin: '0px',
        threshold: 0.5,
        delay: 1500,
      };
      observer = new IntersectionObserver(observerCallback, options);
      observer.observe(intersectionTarget);
    }

    return () => {
      if (intersectionTarget) {
        observer.unobserve(intersectionTarget);
      }
      observer?.disconnect();
    };
  }, [intersectionTargetRef, observerCallback]);

  return { intersectionTargetRef, viewportElementRef };
}
