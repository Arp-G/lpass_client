import { useEffect, useRef } from 'react';

// Checks if the current component is still mounted or not
// Helps to avoid react state update on unmounted component warnings.
// This is an anti-pattern and should be avoided if posible.
// ref: https://medium.com/@shanplourde/avoid-react-state-update-warnings-on-unmounted-components-bcecf054e953
const useIsMounted = () => {
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false }
  }, []);

  return isMounted.current;
};

export default useIsMounted;
