import { formatDuration, formatNumber } from '@/utils/format';
import * as paceUtils from '@/utils/paces';
import * as raceUtils from '@/utils/races';
import { DISTANCE_UNITS, convertDistance, getDefaultDistanceUnit } from '@/utils/units';

/**
 * Format a distance/time result as a key/value result
 * @param {Object} result The distance/time result
 * @param {String} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {Object} The key/value result
 */
export function formatDistTimeResult(result, defaultUnitSystem, preciseDurations = true) {
  // Calculate numerical pace
  const pace = result.time / convertDistance(result.distanceValue, result.distanceUnit,
    getDefaultDistanceUnit(defaultUnitSystem));

  return {
    // Convert distance to key string
    key: formatNumber(result.distanceValue, 0, 2, result.result === 'distance') + ' ' +
      DISTANCE_UNITS[result.distanceUnit].symbol,

    // Convert time to time string
    value: formatDuration(result.time, 3, preciseDurations ? 2 : 0, result.result === 'time'),

    // Convert pace to pace string
    pace: formatDuration(pace, 3, 0, true) + ' / '
      + DISTANCE_UNITS[getDefaultDistanceUnit(defaultUnitSystem)].symbol,

    // Convert dist/time result to key/value
    result: result.result === 'time' ? 'value' : 'key',

    // Use time (in seconds) as sort key
    sort: result.time,
  };
}

/**
 * Calculate paces from a target
 * @param {Object} input The input pace
 * @param {Object} target The pace target
 * @param {String} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {Object} The result
 */
export function calculatePaceResults(input, target, defaultUnitSystem, preciseDurations = true) {
  const result = {
    distanceValue: target.distanceValue,
    distanceUnit: target.distanceUnit,
    time: target.time,
    result: target.type === 'distance' ? 'time' : 'distance',
  };

  const d1 = convertDistance(input.distanceValue, input.distanceUnit, 'meters');

  // Add missing value to result
  if (target.type === 'distance') {
    // Convert target distance into meters
    const d2 = convertDistance(target.distanceValue, target.distanceUnit, 'meters');

    // Calculate time to travel distance at input pace
    result.time = paceUtils.calculateTime(d1, input.time, d2);
  } else {
    // Calculate distance traveled in time at input pace
    const d2 = paceUtils.calculateDistance(input.time, d1, target.time);

    // Convert output distance into default distance unit
    const units = getDefaultDistanceUnit(defaultUnitSystem);
    result.distanceValue = convertDistance(d2, 'meters', units);
    result.distanceUnit = units;
  }

  // Return result
  return formatDistTimeResult(result, defaultUnitSystem, preciseDurations);
}

/**
 * Predict race results from a target
 * @param {Object} input The input race
 * @param {Object} target The race target
 * @param {Object} options The race prediction options
 * @param {String} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {Object} The result
 */
export function calculateRaceResults(input, target, options, defaultUnitSystem,
  preciseDurations = true) {

  const result = {
    distanceValue: target.distanceValue,
    distanceUnit: target.distanceUnit,
    time: target.time,
    result: target.type === 'distance' ? 'time' : 'distance',
  };

  const d1 = convertDistance(input.distanceValue, input.distanceUnit, 'meters');

  // Add missing value to result
  if (target.type === 'distance') {
    // Convert target distance into meters
    const d2 = convertDistance(target.distanceValue, target.distanceUnit, 'meters');

    // Get prediction
    result.time = raceUtils.predictTime(d1, input.time, d2, options.model, options.riegelExponent);
  } else {
    // Get prediction
    let distance = raceUtils.predictDistance(input.time, d1, target.time, options.model,
      options.riegelExponent);

    // Convert output distance into default distance unit
    distance = convertDistance(distance, 'meters',
      getDefaultDistanceUnit(defaultUnitSystem));

    // Update result
    result.distanceValue = distance;
    result.distanceUnit = getDefaultDistanceUnit(defaultUnitSystem);
  }

  // Return result
  return formatDistTimeResult(result, defaultUnitSystem, preciseDurations);
}

/**
 * Calculate race statistics from an input race
 * @param {Object} input The input race
 * @returns {Object} The race statistics
 */
export function calculateRaceStats(input) {
  const d1 = convertDistance(input.distanceValue, input.distanceUnit, 'meters');

  return {
    purdyPoints: raceUtils.getPurdyPoints(d1, input.time),
    vo2Max: raceUtils.getVO2Max(d1, input.time),
    vo2: raceUtils.getVO2(d1, input.time),
    vo2MaxPercentage: raceUtils.getVO2Percentage(input.time) * 100,
  }
}

/**
 * Predict workout results from a target
 * @param {Object} input The input race
 * @param {Object} target The workout target
 * @param {Object} options The race prediction options
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {Object} The result
 */
export function calculateWorkoutResults(input, target, options, preciseDurations = true) {
  const d1 = convertDistance(input.distanceValue, input.distanceUnit, 'meters');
  const t1 = input.time;
  const d3 = convertDistance(target.splitValue, target.splitUnit, 'meters');
  let d2, t2, t3;

  // Calculate pace
  let key = formatNumber(target.splitValue, 0, 2, false) + ' ' +
    DISTANCE_UNITS[target.splitUnit].symbol;
  if (target.type === 'distance') {
    // Convert target distance into meters
    d2 = convertDistance(target.distanceValue, target.distanceUnit, 'meters');
    t2 = raceUtils.predictTime(d1, input.time, d2, options.model, options.riegelExponent);
    if (target.distanceValue != target.splitValue || target.distanceUnit != target.splitUnit) {
      key += ' @ ' + formatNumber(target.distanceValue, 0, 2, false) + ' ' +
        DISTANCE_UNITS[target.distanceUnit].symbol;
    }
  } else {
    t2 = target.time;
    d2 = raceUtils.predictDistance(t1, d1, t2, options.model,
      options.riegelExponent);
    key += ' @ ' + formatDuration(target.time, 3, 2, false);
  }

  t3 = paceUtils.calculateTime(d2, t2, d3);

  // Calculate time
  return {
    key: key,
    value: formatDuration(t3, 3, preciseDurations ? 2 : 0, true),
    pace: '', // Pace not used in workout calculator
    result: 'value',
    sort: t3,
  }
}
