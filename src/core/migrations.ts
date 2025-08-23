/*
 * Contains a function for migrating localStorage items after app updates
 */

import { defaultBatchOptions, defaultGlobalOptions, defaultPaceOptions, defaultRaceOptions,
  defaultSplitOptions, defaultWorkoutOptions } from '@/core/calculators';
import { deepCopy, getLocalStorage, setLocalStorage, unsetLocalStorage } from '@/core/utils';

/*
 * The type for string-indexable objects
 */
type dict = {
  [key: string]: json,
};

/*
 * The type for JSON-compatable values
 */
type json = dict | string | number | boolean;

/**
 * Get the value of an arbitrary property on an object
 * @param {dict} obj The object
 * @param {string} key The property path
 * @returns {json | undefined} The value of the property
 */
function getObjProperty(obj: dict, key: string): json | undefined {
  const keys = key.split(".");
  while (true) {
    if (keys.length === 0) {
      return obj;
    } else if (obj[keys[0]] === undefined) {
      return undefined;
    } else {
      obj = obj[keys[0]] as dict;
      keys.shift();
    }
  }
}

/**
 * Set the value of an arbitrary property on an object
 * @param {dict} obj The object
 * @param {string} key The property path
 * @param {json} value The new value of the property
 */
function setObjProperty(obj: dict, key: string, value: json) {
  const keys = key.split(".");
  while (true) {
    if (keys.length === 1) {
      obj[keys[0]] = value;
      return;
    } else if (obj[keys[0]] === undefined) {
      obj[keys[0]] = {};
      obj = obj[keys[0]] as dict;
      keys.shift();
    } else {
      obj = obj[keys[0]] as dict;
      keys.shift();
    }
  }
}

/**
 * Remove an arbitrary property on an object
 * @param {dict} obj The object
 * @param {string} key The property path
 */
function removeObjProperty(obj: dict, key: string) {
  const keys = key.split(".");
  while (true) {
    if (keys.length === 1) {
      delete obj[keys[0]];
      return;
    } else if (obj[keys[0]] === undefined) {
      return;
    } else {
      obj = obj[keys[0]] as dict;
      keys.shift();
    }
  }
}

/**
 * Add a property to an existing localStorage item
 * @param {string} dest The localStorage item
 * @param {string} key The localStorage item property path
 * @param {object | string | number | boolean} value The default property value
 */
function addProperty(dest: string, key: string, value: object | string | number | boolean) {
  const dest_value = getLocalStorage<dict>(dest);
  if (dest_value !== null && getObjProperty(dest_value, key) === undefined) {
    setObjProperty(dest_value, key, deepCopy(value as json));
    setLocalStorage(dest, dest_value);
  }
}

/**
 * Move an existing localStorage property to a new location
 * @param {string} src The original localStorage item
 * @param {string} src_key The original localStorage item property path
 * @param {string} dest The new parent localStorage item
 * @param {string} dest_key The new localStorage item property path
 * @param {object} dest_default The default value of the new parent localStorage item
 */
function moveProperty(src: string, src_key: string, dest: string, dest_key: string,
                      dest_default: object) {
  const src_value = getLocalStorage<dict>(src);
  const dest_value = getLocalStorage<dict>(dest) || deepCopy(dest_default as dict);
  if (src_value !== null && getObjProperty(src_value, src_key) !== undefined) {
    setObjProperty(dest_value, dest_key, getObjProperty(src_value, src_key) as json);
    setLocalStorage(dest, dest_value);
    removeObjProperty(src_value, src_key);
    setLocalStorage(src, src_value);
  }
  addProperty(dest, dest_key, getObjProperty(dest_default as dict, dest_key) as json);
}

/**
 * Move an existing localStorage item to a property of another localStorage item
 * @param {string} src The original localStorage item
 * @param {string} dest The new parent localStorage item
 * @param {string} dest_key The new localStorage item property path
 * @param {object} dest_default The default value of the new parent localStorage item
 */
function moveItemToProperty(src: string, dest: string, dest_key: string, dest_default: object) {
  const src_value = getLocalStorage<dict>(src);
  const dest_value = getLocalStorage<dict>(dest) || deepCopy(dest_default as dict);
  if (src_value !== null) {
    setObjProperty(dest_value, dest_key, src_value);
    setLocalStorage(dest, dest_value);
    unsetLocalStorage(src);
  }
  addProperty(dest, dest_key, (dest_default as dict)[dest_key]);
}

/**
 * Migrate outdated localStorage options
 */
export function migrateLocalStorage() {
  // Move default-unit-system to global-options.defaultUnitSystem (>1.4.1)
  moveItemToProperty('default-unit-system', 'global-options', 'defaultUnitSystem',
                     defaultGlobalOptions);

  // Move {race,workout}-calculator-options.{model,riegelExponent} into
  // global-options.racePredictionOptions (>1.4.1)
  moveProperty('workout-calculator-options', 'model', 'global-options',
               'racePredictionOptions.model', defaultGlobalOptions);
  moveProperty('workout-calculator-options', 'riegelExponent', 'global-options',
               'racePredictionOptions.riegelExponent', defaultGlobalOptions);
  moveProperty('race-calculator-options', 'model', 'global-options',
               'racePredictionOptions.model', defaultGlobalOptions);
  moveProperty('race-calculator-options', 'riegelExponent', 'global-options',
               'racePredictionOptions.riegelExponent', defaultGlobalOptions);

  // Add label property to batch-calculator-options (>1.4.1)
  addProperty('batch-calculator-options', 'label', defaultBatchOptions.label);

  // Add customTargetNames property to workout-calculator-options (>1.4.1)
  addProperty('workout-calculator-options', 'customTargetNames',
              defaultWorkoutOptions.customTargetNames);

  // Move *-calculator-input into *-calculator-options (>1.4.1)
  moveItemToProperty('batch-calculator-input', 'batch-calculator-options',
                     'input', defaultBatchOptions);
  moveItemToProperty('pace-calculator-input', 'pace-calculator-options',
                     'input', defaultPaceOptions);
  moveItemToProperty('race-calculator-input', 'race-calculator-options',
                     'input', defaultRaceOptions);
  moveItemToProperty('workout-calculator-input', 'workout-calculator-options',
                     'input', defaultWorkoutOptions);

  // Move *-calculator-target-set into *-calculator-options (>1.4.1)
  moveItemToProperty('pace-calculator-target-set', 'pace-calculator-options',
                     'selectedTargetSet', defaultPaceOptions);
  moveItemToProperty('race-calculator-target-set', 'race-calculator-options',
                     'selectedTargetSet', defaultRaceOptions);
  moveItemToProperty('split-calculator-target-set', 'split-calculator-options',
                     'selectedTargetSet', defaultSplitOptions);
  moveItemToProperty('workout-calculator-target-set', 'workout-calculator-options',
                     'selectedTargetSet', defaultWorkoutOptions);
}
