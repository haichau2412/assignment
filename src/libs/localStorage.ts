export const getLocalStorage = (key: string, defaultData?: unknown) => {
  if (typeof window !== "undefined") {
    const localData = localStorage.getItem(key);

    if (localData) {
      return JSON.parse(localData);
    }
  }

  return defaultData;
};

export const setLocalStorage = (key: string, value: unknown) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
