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
    .catch(_err => false);
}

/*
  Update online state depending on connectivity status.
  Don't update online state if state is already updated
*/
export const handleConnection = (setOnline: (status: boolean) => void) => {
  if (window.navigator.onLine) {
    isReachable(window.location.origin).then((isOnline) => {
      setOnline(isOnline || false);
    });
  } else {
    setOnline(false);
  }
}

export default (setOnline: (status: boolean) => void) => {
  window.addEventListener('online', () => {
    console.log('online event')
    handleConnection(setOnline)
  });
  window.addEventListener('offline', () => handleConnection(setOnline));

  // Set initial state
  handleConnection(setOnline);
};
