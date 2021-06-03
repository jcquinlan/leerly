import {useState} from 'react';
import moment from 'moment';

export const REFERRAL_CODE_KEY = 'leerly_referral_code';
export const STORYBOOK_ACTIVE_KEY = 'leerly_storybook_active';
export const TRANSLATIONS_TODAY_KEY = 'sldkuen_12f489j_block';
export const ONE_TRANSLATION_DONE_KEY = '3uhw3irwh3_deuhfss_block';

export function useLocalStorage(key, initialValue) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() => {
      try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        // If error also return initialValue
        console.log(error);
        return initialValue;
      }
    });
  
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = value => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.log(error);
      }
    };
  
    return [storedValue, setValue];
  }

  export const initialTranslationsToday = () => {
    return {
      date: moment().startOf('day'),
      count: 0
    };
  }