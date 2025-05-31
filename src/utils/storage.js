// The global localStorage prefix
const prefix = 'running-tools';

/**
 * Read an object from a localStorage item
 * @param {String} key The localStorage item's key
 * @returns {Object} The object
 */
export function get(key) {
  try {
    return JSON.parse(localStorage.getItem(`${prefix}.${key}`));
  } catch {
    return null;
  }
}

/**
 * Write an object to a localStorage item
 * @param {String} key The localStorage item's key
 * @param {Object} value The object to write
 */
export function set(key, value) {
  localStorage.setItem(`${prefix}.${key}`, JSON.stringify(value));
}

/**
 * Migrate outdated localStorage options
 */
export function migrate() {
  // Add customTargetNames property to workout options (>1.4.1)
  let workoutOptions = get('workout-calculator-options');
  if (workoutOptions !== null && workoutOptions.customTargetNames === undefined) {
    workoutOptions.customTargetNames = false;
    set('workout-calculator-options', workoutOptions);
  }
}
