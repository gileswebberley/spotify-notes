import { useCallback, useEffect, useRef } from 'react';
/**
 *
 * @param {Function} callbackFn - function to execute on intersection with arguments of target element and observer object eg callback(target, observer)
 * @param {Object} options - default: none - same as options object detailed here https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API except that the root is always the viewportElementRef or if not set then it is the browser viewport
 * @param {Boolean} singleUse - default: true - whether to remove the observer after it has first triggered the callbackFn (ie when using it for infinite scroll loading you'll want it to only trigger once when it first comes into view)
 * @typedef {Object} Refs
 * @property {React.Ref} intersectionTargetRef - attach this to the element that you are tracking the intersection of - ie when observing a div it would be <div ref={intersectionTargetRef}></div>
 * @property {React.Ref} viewportElementRef - defaults to the browser viewport but can be any element so it would trigger the callback when intersectionTargetRef element entered the element with this ref attached (MUST BE AN ANCESTOR OF THE TARGET ELEMENT)
 * @returns {Refs} An object containing the refs to attach to the element to be observed and optionally the ancestor element to behave as the viewport
 */
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
  }, [intersectionTargetRef, observerCallback, options]);

  return { intersectionTargetRef, viewportElementRef };
}
