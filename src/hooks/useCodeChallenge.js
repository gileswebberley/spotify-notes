import { useRef } from 'react';
//This is no longer allowed as a way to authorize with Spotify :(
export function useCodeChallenge() {
  //   const [code, setCode] = useState('');
  const code = useRef('');
  const error = useRef('');
  const urlParams = new URLSearchParams(window.location.search);
  let urlCode = urlParams.get('code');
  let errorCode = urlParams.get('error');
  if (errorCode) {
    console.error(`Error returned from Spotify auth: ${errorCode}`);
    error.current = errorCode;
    code.current = '';
  } else if (urlCode) {
    console.log(`useCodeChallenge found code: ${urlCode}....setting state`);
    code.current = urlCode;
    error.current = '';
    console.log(`code is now ${code.current}`);
  }

  return { code: code.current, error: error.current };
}
