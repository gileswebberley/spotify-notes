import { useRef } from 'react';
import { REDIRECT_URI } from '../utils/constants';
let urlCode = '';
let errorCode = '';
export function useCodeChallenge() {
  const code = useRef('');
  const error = useRef('');
  // if (urlCode || errorCode) {
  //   console.log(
  //     `returning early from useCodeChallenge as we already have the code ${urlCode}`
  //   );
  //   return { code: urlCode, error: errorCode };
  // }
  // const urlParams = new URLSearchParams(window.location.search);
  // urlCode = urlParams.get('code');
  // errorCode = urlParams.get('error');
  if (error.current) {
    console.error(`Error returned from Spotify auth: ${error.current}`);
    // urlCode = '';
    // error.current = errorCode;
    code.current = '';
  } else if (code.current) {
    console.log(
      `useCodeChallenge found code: ${code.current}....setting state`
    );
    // errorCode = '';
    // code.current = urlCode;
    error.current = '';
    //Having spent 2 days trying to get Spotify to accept my code and return a token I tried to clear the code from the url and it seems to have worked!! However this now thinks we have no code and so it goes back to the Spotify code grabbing functionality - I will try to early return if the code ref is already set....of course not because that makes the useRef conditional which is very much not allowed!!
    // window.location.href = REDIRECT_URI;
    // console.log(`code is now ${code.current}`);
    console.log(`code is now ${code.current}`);
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    code.current = urlParams.get('code');
    error.current = urlParams.get('error');
  }

  return { code: code.current, error: error.current };
}
