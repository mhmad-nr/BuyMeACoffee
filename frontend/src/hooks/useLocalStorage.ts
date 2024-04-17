import { useState } from "react";
import { LocalStorageEnum } from "../types";


export const useLocalStorage = () => {
  const [value, setValue] = useState<string | null>(null);

  const setItem = (key: LocalStorageEnum, value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: LocalStorageEnum) => {
    const value = localStorage.getItem(key);
    setValue(value);
    return value;
  };

  const removeItem = (key: LocalStorageEnum) => {
    localStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};
