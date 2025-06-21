/**
 * Create a deep copy of an object
 * @param {object} value The object to copy
 * @returns {object} The copied object
 */
export function deepCopy(value: object): object {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Test whether two objects are deeply equal
 * @param {object} value1 The first object
 * @param {object} value2 The second object
 * @returns {boolean} Whether the two objects are equal
 */
export function deepEqual(value1: object, value2: object): boolean {
  return JSON.stringify(value1) === JSON.stringify(value2);
}
