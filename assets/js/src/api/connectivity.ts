/*
* Check Internet connectivity
* Reference: https://stackoverflow.com/questions/44756154/progressive-web-app-how-to-detect-and-handle-when-connection-is-up-again/44766737
*/

export default (setOnline: (status: boolean) => void) => {

  const handleConnection = () => {
    if (window.navigator.onLine) {
      isReachable(window.location.origin).then((online) => {
        if (online) setOnline(true);
        else setOnline(false);
      });
    } else {
      setOnline(false);
    }
  }

  function isReachable(url: string) {
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

  window.addEventListener('online', handleConnection);
  window.addEventListener('offline', handleConnection);
};
