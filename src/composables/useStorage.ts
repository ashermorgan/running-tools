import { ref, onActivated, watchEffect } from 'vue';
import type { Ref } from 'vue';

import * as storage from '@/utils/storage';

/*
 * Create a reactive value that is synced with a localStorage item
 * @param {string} key The localStorage item's key
 * @param {object} defaultValue The default value
 * @returns {Ref<object>} The synchronized ref
 */
export default function useStorage(key: string, defaultValue: object): Ref<object> {
  const clonedDefault = JSON.parse(JSON.stringify(defaultValue));
  const value = ref(clonedDefault);

  // (Re)load value from localStorage
  function updateValue() {
    const parsedValue = storage.get(key);
    if (parsedValue !== null) value.value = parsedValue;
  }
  updateValue();
  onActivated(updateValue);

  // Save value to localStorage when modified
  watchEffect(() => {
    if (typeof localStorage !== 'undefined') {
      storage.set(key, value.value);
    }
  })

  return value
}
