import { ref, onActivated, watchEffect } from 'vue';

// The global localStorage prefix
const prefix = 'running-tools';

/*
 * Create a reactive value that is synced with a localStorage item
 * @param {String} key The localStorage item's key
 * @defaultValue {Object} defaultValue The default value
 */
export default function useStorage(key, defaultValue) {
  const clonedDefault = JSON.parse(JSON.stringify(defaultValue));
  const value = ref(clonedDefault);

  // (Re)load value from localStorage
  function updateValue() {
    let parsedValue;
    try {
      parsedValue = JSON.parse(localStorage.getItem(`${prefix}.${key}`));
    } catch {
      parsedValue = null;
    }
    if (parsedValue !== null) value.value = parsedValue;
  }
  updateValue();
  onActivated(updateValue);

  // Save value to localStorage when modified
  watchEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(`${prefix}.${key}`, JSON.stringify(value.value));
    }
  })

  return value
}
