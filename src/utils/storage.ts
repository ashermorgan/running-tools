// The global localStorage prefix
const prefix = 'running-tools';

/**
 * Read an object from a localStorage item
 * @param {string} key The localStorage item's key
 * @returns {Type} The object
 */
export function get<Type>(key: string): Type | null {
  try {
    return JSON.parse(localStorage.getItem(`${prefix}.${key}`) || '');
  } catch {
    return null;
  }
}

/**
 * Write an object to a localStorage item
 * @param {string} key The localStorage item's key
 * @param {Type} value The object to write
 */
export function set<Type>(key: string, value: Type) {
  localStorage.setItem(`${prefix}.${key}`, JSON.stringify(value));
}

/**
 * Migrate outdated localStorage options
 */
export function migrate() {
  // Add customTargetNames property to workout options (>1.4.1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const workoutOptions = get('workout-calculator-options') as any; // TODO: update types
  if (workoutOptions !== null && workoutOptions.customTargetNames === undefined) {
    workoutOptions.customTargetNames = false;
    set('workout-calculator-options', workoutOptions);
  }
}
