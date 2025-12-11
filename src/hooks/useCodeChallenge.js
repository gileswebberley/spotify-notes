import { useRef } from 'react';
export function useCodeChallenge() {
  //We don't want to cause any rerenders here so I'm not going to use useState, and it would be great if it were persistent hence the use of useRef
  const code = useRef('');
  const error = useRef('');
  //we'll check whether we have already got a code or error first before trying to parse the url - this is important as we don't want to keep resetting the refs on every render
  if (error.current) {
    console.error(`Error returned from Spotify auth: ${error.current}`);
    //I'm setting these to an empty string but maybe I should follow the lead of Supabase and Spotify and set it to null instead?
    code.current = null;
    //we don't throw an actual error as we want to leave it open to be dealt with by the component using this hook...
  } else if (code.current) {
    // console.log(
    //   `useCodeChallenge found code: ${code.current}....setting state`
    // );
    error.current = null;
    //THIS COMMENT IS WRONG HOWEVER I'M LEAVING IT FOR REFERENCE AND LEARNINGS - Having spent 2 days trying to get Spotify to accept my code and return a token I tried to clear the code from the url and it seems to have worked!! However this now thinks we have no code and so it goes back to the Spotify code grabbing functionality - I will try to early return if the code ref is already set....of course not because that makes the useRef conditional which is very much not allowed!!
    //SOLUTION - The problem was actually that I was sending [object Promise] as the code challenge because I was not awaiting the sha256 function!!
    // console.log(`code is now ${code.current}`);
  } else {
    //we have not got a code or an error yet so we'll parse the url params to see if we have been redirected back from Spotify with either
    const urlParams = new URLSearchParams(window.location.search);
    code.current = urlParams.get('code');
    error.current = urlParams.get('error');
  }

  return { code: code.current, error: error.current };
}
