import { useEffect, useLayoutEffect, useRef, useState } from 'react';
//This is no longer allowed as a way to authorize with Spotify :(
export function useCodeChallenge() {
  //   const [code, setCode] = useState('');
  const code = useRef('');
  const urlParams = new URLSearchParams(window.location.search);
  let urlCode = urlParams.get('code');
  if (urlCode) {
    console.log(`useCodeChallenge found code: ${urlCode}....setting state`);
    // setCode(() => {
    //   return urlCode;
    // });
    code.current = urlCode;
    console.log(`code is now ${code.current}`);
  }

  return code.current;
}
