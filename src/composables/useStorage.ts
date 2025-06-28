import { ref, onActivated, watchEffect } from 'vue';
import type { Ref } from 'vue';

import * as storage from '@/utils/storage';

/*
 * Create a reactive value that is synced with a localStorage item
 * @param {string} key The localStorage item's key
 * @param {Type} defaultValue The default value
 * @returns {Ref<Type>} The synchronized ref
 */
export default function useStorage<Type>(key: string, defaultValue: Type): Ref<Type> {
  const clonedDefault: Type = JSON.parse(JSON.stringify(defaultValue));
  const value: Ref<Type> = ref<Type>(clonedDefault) as Ref<Type>;

  // (Re)load value from localStorage
  function updateValue() {
    const parsedValue = storage.get<Type>(key);
    if (parsedValue !== null) value.value = parsedValue;
  }
  updateValue();
  onActivated(updateValue);

  // Save value to localStorage when modified
  watchEffect(() => {
    if (typeof localStorage !== 'undefined') {
      storage.set<Type>(key, value.value);
    }
  })

  return value
}
