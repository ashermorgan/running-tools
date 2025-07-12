/*
 * Contains utility functions for handling nested objects and interacting with localStorage
 */

import { defaultRaceOptions, defaultWorkoutOptions } from '@/core/calculators';

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

/**
 * Migrate outdated localStorage options
 */
export function migrateLocalStorage() {
  /* eslint-disable @typescript-eslint/no-explicit-any */

  // Move pace-calculator-target-set into new pace-calculator-options (>1.4.1)
  const paceSelectedTargetSet = getLocalStorage<string>('pace-calculator-target-set');
  if (paceSelectedTargetSet !== null) {
    const paceOptions = { selectedTargetSet: paceSelectedTargetSet };
    setLocalStorage('pace-calculator-options', paceOptions);
    unsetLocalStorage('pace-calculator-target-set');
  }

  // Move race-calculator-target-set into race-calculator-options (>1.4.1)
  const raceSelectedTargetSet = getLocalStorage<string>('race-calculator-target-set');
  const raceOptions = getLocalStorage<any>('race-calculator-options')
    || deepCopy(defaultRaceOptions);
  if (raceSelectedTargetSet !== null) {
    raceOptions.selectedTargetSet = raceSelectedTargetSet;
    setLocalStorage('race-calculator-options', raceOptions);
    unsetLocalStorage('race-calculator-target-set');
  }
  if (raceOptions !== null && raceOptions.selectedTargetSet === undefined) {
    raceOptions.selectedTargetSet = defaultRaceOptions.selectedTargetSet;
    setLocalStorage('race-calculator-options', raceOptions);
  }

  // Move split-calculator-target-set into new split-calculator-options (>1.4.1)
  const splitSelectedTargetSet = getLocalStorage<string>('split-calculator-target-set');
  if (splitSelectedTargetSet !== null) {
    const splitOptions = { selectedTargetSet: splitSelectedTargetSet };
    setLocalStorage('split-calculator-options', splitOptions);
    unsetLocalStorage('split-calculator-target-set');
  }

  // Move workout-calculator-target-set into workout-calculator-options (>1.4.1)
  const workoutSelectedTargetSet = getLocalStorage<string>('workout-calculator-target-set');
  const workoutOptions = getLocalStorage<any>('workout-calculator-options')
    || deepCopy(defaultWorkoutOptions);
  if (workoutSelectedTargetSet !== null) {
    workoutOptions.selectedTargetSet = workoutSelectedTargetSet;
    setLocalStorage('workout-calculator-options', workoutOptions);
    unsetLocalStorage('workout-calculator-target-set');
  }
  if (workoutOptions !== null && workoutOptions.selectedTargetSet === undefined) {
    workoutOptions.selectedTargetSet = defaultWorkoutOptions.selectedTargetSet;
    setLocalStorage('workout-calculator-options', workoutOptions);
  }

  // Add customTargetNames property to workout-calculator-options (>1.4.1)
  if (workoutOptions.customTargetNames === undefined) {
    workoutOptions.customTargetNames = false;
    setLocalStorage('workout-calculator-options', workoutOptions);
  }

  /* eslint-enable @typescript-eslint/no-explicit-any */
}
