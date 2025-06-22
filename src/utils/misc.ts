/**
 * Create a deep copy of an object
 * @param {Type} value The object to copy
 * @returns {Type} The copied object
 */
export function deepCopy<Type>(value: Type): Type {
  return JSON.parse(JSON.stringify(value));
}

/**
 * Test whether two objects are deeply equal
 * @param {Type} value1 The first object
 * @param {Type} value2 The second object
 * @returns {boolean} Whether the two objects are equal
 */
export function deepEqual<Type>(value1: Type, value2: Type): boolean {
  return JSON.stringify(value1) === JSON.stringify(value2);
}
