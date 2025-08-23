/*
 * Contains utility functions for handling nested objects and interacting with localStorage
 */

// The global localStorage prefix
const LocalStoragePrefix = 'running-tools';

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

/**
 * Read an object from a localStorage item
 * @param {string} key The localStorage item's key
 * @returns {Type} The object
 */
export function getLocalStorage<Type>(key: string): Type | null {
  try {
    return JSON.parse(localStorage.getItem(`${LocalStoragePrefix}.${key}`) || '');
  } catch {
    return null;
  }
}

/**
 * Write an object to a localStorage item
 * @param {string} key The localStorage item's key
 * @param {Type} value The object to write
 */
export function setLocalStorage<Type>(key: string, value: Type) {
  localStorage.setItem(`${LocalStoragePrefix}.${key}`, JSON.stringify(value));
}

/**
 * Delete a localStorage item
 * @param {string} key The localStorage item's key
 */
export function unsetLocalStorage(key: string) {
  localStorage.removeItem(`${LocalStoragePrefix}.${key}`);
}
