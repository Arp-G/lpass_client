// Ref: https://blog.logrocket.com/offline-storage-for-pwas/

import { useState, useEffect, useCallback } from "react";
import { set, get } from "idb-keyval";

export default function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T | undefined>(undefined);

  // When this hook is loaded or any of the deps change then if key not 
  // already set then set the given key to some default value in index DB 
  // and also load the value in a local state.
  useEffect(() => {
    get<T>(key)
      .then(value => setState(value ?? defaultValue));
  }, [key, setState, defaultValue]);

  // When called updates the value in indexDB and updates local state;
  const setPersistedValue = useCallback((newValue: T) => {
    setState(newValue);
    set(key, newValue);
  }, [key, setState]);

  return [state, setPersistedValue] as const;
}
