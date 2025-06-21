/**
 * Create a deep copy of an object
 * @param {Object} value The object to copy
 * @returns {Object} The copied object
 */
export function deepCopy(value) {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Test whether two objects are deeply equal
 * @param {Object} value1 The first object
 * @param {Object} value2 The second object
 * @returns {Boolean} Whether the two objects are equal
 */
export function deepEqual(value1, value2) {
  return JSON.stringify(value1) === JSON.stringify(value2);
}
