import { deepCopy } from '@/utils/misc';
import { defaultRaceOptions, defaultWorkoutOptions } from '@/utils/calculators';

// The global localStorage prefix
const LocalStoragePrefix = 'running-tools';

/**
 * Read an object from a localStorage item
 * @param {string} key The localStorage item's key
 * @returns {Type} The object
 */
export function get<Type>(key: string): Type | null {
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
export function set<Type>(key: string, value: Type) {
  localStorage.setItem(`${LocalStoragePrefix}.${key}`, JSON.stringify(value));
}

/**
 * Delete a localStorage item
 * @param {string} key The localStorage item's key
 */
export function unset(key: string) {
  localStorage.removeItem(`${LocalStoragePrefix}.${key}`);
}

/**
 * Migrate outdated localStorage options
 */
export function migrate() {
  /* eslint-disable @typescript-eslint/no-explicit-any */

  // Move pace-calculator-target-set into new pace-calculator-options (>1.4.1)
  const paceSelectedTargetSet = get<string>('pace-calculator-target-set');
  if (paceSelectedTargetSet !== null) {
    const paceOptions = { selectedTargetSet: paceSelectedTargetSet };
    set('pace-calculator-options', paceOptions);
    unset('pace-calculator-target-set');
  }

  // Move race-calculator-target-set into race-calculator-options (>1.4.1)
  const raceSelectedTargetSet = get<string>('race-calculator-target-set');
  const raceOptions = get<any>('race-calculator-options')
    || deepCopy(defaultRaceOptions);
  if (raceSelectedTargetSet !== null) {
    raceOptions.selectedTargetSet = raceSelectedTargetSet;
    set('race-calculator-options', raceOptions);
    unset('race-calculator-target-set');
  }
  if (raceOptions !== null && raceOptions.selectedTargetSet === undefined) {
    raceOptions.selectedTargetSet = defaultRaceOptions.selectedTargetSet;
    set('race-calculator-options', raceOptions);
  }

  // Move split-calculator-target-set into new split-calculator-options (>1.4.1)
  const splitSelectedTargetSet = get<string>('split-calculator-target-set');
  if (splitSelectedTargetSet !== null) {
    const splitOptions = { selectedTargetSet: splitSelectedTargetSet };
    set('split-calculator-options', splitOptions);
    unset('split-calculator-target-set');
  }

  // Move workout-calculator-target-set into workout-calculator-options (>1.4.1)
  const workoutSelectedTargetSet = get<string>('workout-calculator-target-set');
  const workoutOptions = get<any>('workout-calculator-options')
    || deepCopy(defaultWorkoutOptions);
  if (workoutSelectedTargetSet !== null) {
    workoutOptions.selectedTargetSet = workoutSelectedTargetSet;
    set('workout-calculator-options', workoutOptions);
    unset('workout-calculator-target-set');
  }
  if (workoutOptions !== null && workoutOptions.selectedTargetSet === undefined) {
    workoutOptions.selectedTargetSet = defaultWorkoutOptions.selectedTargetSet;
    set('workout-calculator-options', workoutOptions);
  }

  // Add customTargetNames property to workout-calculator-options (>1.4.1)
  if (workoutOptions.customTargetNames === undefined) {
    workoutOptions.customTargetNames = false;
    set('workout-calculator-options', workoutOptions);
  }

  /* eslint-enable @typescript-eslint/no-explicit-any */
}
