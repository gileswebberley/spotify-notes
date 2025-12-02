import { useCallback, useEffect, useRef } from 'react';

export function useIntersection(callbackFn, options = {}, singleUse = true) {
  const intersectionTargetRef = useRef(null);
  const viewportElementRef = useRef(null);

  const observerCallback = useCallback(
    (entries, observer) => {
      const target = entries[0];
      if (target.isIntersecting) {
        callbackFn(target, observer);
        if (singleUse) {
          observer.unobserve(target.target);
        }
      }
    },
    [callbackFn, singleUse]
  );

  //if no viewportElement is set then it will be null which will make it default to the browser window
  useEffect(() => {
    let observer;
    const intersectionTarget = intersectionTargetRef?.current;
    if (intersectionTarget) {
      const optionsObj = {
        ...options,
        root: viewportElementRef?.current,
      };
      observer = new IntersectionObserver(observerCallback, optionsObj);
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
