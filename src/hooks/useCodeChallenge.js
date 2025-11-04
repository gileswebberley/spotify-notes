import { useRef } from 'react';
export function useCodeChallenge() {
  const code = useRef('');
  const error = useRef('');
  if (error.current) {
    console.error(`Error returned from Spotify auth: ${error.current}`);
    code.current = '';
  } else if (code.current) {
    console.log(
      `useCodeChallenge found code: ${code.current}....setting state`
    );
    error.current = '';
    //WRONG - Having spent 2 days trying to get Spotify to accept my code and return a token I tried to clear the code from the url and it seems to have worked!! However this now thinks we have no code and so it goes back to the Spotify code grabbing functionality - I will try to early return if the code ref is already set....of course not because that makes the useRef conditional which is very much not allowed!!
    //The problem was actually that I was sending [object Promise] as the code challenge because I was not awaiting the sha256 function!!
    console.log(`code is now ${code.current}`);
  } else {
    const urlParams = new URLSearchParams(window.location.search);
    code.current = urlParams.get('code');
    error.current = urlParams.get('error');
  }

  return { code: code.current, error: error.current };
}
