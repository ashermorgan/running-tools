// The global localStorage prefix
const prefix = 'running-tools';

/**
 * Get the value of a key from localStorage
 * @param {String} key The key
 * @param {Object} defaultValue The default value
 * @returns {Object} The value
 */
function get(key, defaultValue) {
  // Clone defaultValue
  const clonedDefault = JSON.parse(JSON.stringify(defaultValue));

  if (key === null) {
    return clonedDefault;
  }
  let value;
  try {
    value = JSON.parse(localStorage.getItem(`${prefix}.${key}`));
  } catch {
    return clonedDefault;
  }
  return value === null ? clonedDefault : value;
}

/**
 * Set the value of a key in localStorage
 * @param {String} key The key
 * @param {Object} value The value
 * */
function set(key, value) {
  localStorage.setItem(`${prefix}.${key}`, JSON.stringify(value));
}

export default {
  get,
  set,
};
