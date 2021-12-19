/*
* Check Internet connectivity
* Reference: https://stackoverflow.com/questions/44756154/progressive-web-app-how-to-detect-and-handle-when-connection-is-up-again/44766737
*/

export const isReachable = (url = window.location.origin) => {
  /**
   * Note: fetch() still "succeeds" for 404s on subdirectories,
   * which is ok when only testing for domain reachability.
   *
   * Example:
   *   https://google.com/noexist does not throw
   *   https://noexist.com/noexist does throw
   */
  return fetch(url, { method: 'HEAD', mode: 'no-cors' })
    .then(resp => resp && (resp.ok || resp.type === 'opaque'))
    .catch(err => console.warn('[conn test failure]:', err));
}

const handleConnection = (onlineState: boolean, setOnline: (status: boolean) => void) => {
  if (window.navigator.onLine) {
    isReachable(window.location.origin).then((isOnline) => {
      if (isOnline && !onlineState) {
        setOnline(true);
        console.log('Check connectivity: true')
      }
      else if (!isOnline && onlineState) {
         setOnline(false);
         console.log('Check connectivity: false 1 ' + isOnline)
      }
    });
  } else if (onlineState) {
    console.log('Check connectivity: false 2')
    setOnline(false);
  }
}

export default (onlineState: boolean, setOnline: (status: boolean) => void) => {
  // setInterval(() => handleConnection(onlineState, setOnline), 5000);

  window.addEventListener('online', () => {
    console.log('online event')
    handleConnection(onlineState, setOnline)
  });
  window.addEventListener('offline', () => handleConnection(onlineState, setOnline));

  // Set initial state
  handleConnection(onlineState, setOnline);
};
