import {StoreKey} from '../StoreKey';

export function getValueFromStorage<T>(key: StoreKey, defaultValue: T): T {
  const asString = localStorage.getItem(key);
  if (asString != null) {
    try {
      return JSON.parse(asString);
    } catch (e) {
      console.error(`Unable to parse ${key} from storage:`, e);
      localStorage.removeItem(key);
    }
  }

  return defaultValue;
}
