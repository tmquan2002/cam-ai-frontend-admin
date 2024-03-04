import * as React from "react";

type UseStateHook<T> = [[boolean, T | null], (value: T | null) => void];

function useAsyncState<T>(
  initialValue: [boolean, T | null] = [true, null]
): UseStateHook<T> {
  return React.useReducer(
    (
      _state: [boolean, T | null],
      action: T | null = null
    ): [boolean, T | null] => [false, action],
    initialValue
  ) as UseStateHook<T>;
}

export function setStorageItem(key: string, value: string | null) {
  try {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.error("Local storage is unavailable:", e);
  }
}

export function useStorageState(key: string): UseStateHook<string> {
  // Public
  const [state, setState] = useAsyncState<string>();

  // Get
  React.useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        setState(localStorage.getItem(key));
      }
    } catch (e) {
      console.error("Local storage is unavailable:", e);
    }
  }, [key]);

  // Set
  const setValue = React.useCallback(
    (value: string | null) => {
      setState(value);
      setStorageItem(key, value);
    },
    [key]
  );

  return [state, setValue];
}

export const useLocalStorageCustomHook = (key: string, defaultValue: any) => {
  const [value, setValue] = React.useState(() => {
    let currentValue;

    try {
      const storageResult = localStorage.getItem(key)
      if (storageResult) {
        currentValue = JSON.parse(storageResult)
      } else {
        currentValue = defaultValue;
      }
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  React.useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [value, key]);

  return [value, setValue];
};

export const useLocalStorageCustomHookObject = (key: string, defaultValue: any) => {
  const [value, setValue] = React.useState(() => {
    let currentValue;

    try {
      const storageResult = localStorage.getItem(key)
      if (storageResult) {
        currentValue = JSON.parse(storageResult)
      } else {
        currentValue = defaultValue;
      }
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  const updateValue = (property: string, newValue: any) => {
    setValue((prevValue: any) => {
      const updatedValue = { ...prevValue, [property]: newValue };
      localStorage.setItem(key, JSON.stringify(updatedValue));
      return updatedValue;
    });
  };

  return [value, updateValue];
};