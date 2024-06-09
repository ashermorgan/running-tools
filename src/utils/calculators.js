import formatUtils from '@/utils/format';
import paceUtils from '@/utils/paces';
import raceUtils from '@/utils/races';
import unitUtils from '@/utils/units';

/**
 * Format a distance/time result as a key/value result
 * @param {Object} result The distance/time result
 * @param {String} defaultUnitSystem The default unit system (imperial or metric)
 * @returns {Object} The key/value result
 */
function formatDistTimeResult(result, defaultUnitSystem) {
  // Calculate numerical pace
  const pace = result.time / unitUtils.convertDistance(result.distanceValue, result.distanceUnit,
    unitUtils.getDefaultDistanceUnit(defaultUnitSystem));

  return {
    // Convert distance to key string
    key: formatUtils.formatNumber(result.distanceValue, 0, 2, result.result === 'distance') + ' '
      + unitUtils.DISTANCE_UNITS[result.distanceUnit].symbol,

    // Convert time to time string
    value: formatUtils.formatDuration(result.time, 3, 2, result.result === 'time'),

    // Convert pace to pace string
    pace: formatUtils.formatDuration(pace, 3, 0, true) + ' / '
      + unitUtils.DISTANCE_UNITS[unitUtils.getDefaultDistanceUnit(defaultUnitSystem)].symbol,

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
 * @returns {Object} The result
 */
function calculatePaceResults(input, target, defaultUnitSystem) {
  const result = {
    distanceValue: target.distanceValue,
    distanceUnit: target.distanceUnit,
    time: target.time,
    result: target.type === 'distance' ? 'time' : 'distance',
  };

  const d1 = unitUtils.convertDistance(input.distanceValue, input.distanceUnit, 'meters');

  // Add missing value to result
  if (target.type === 'distance') {
    // Convert target distance into meters
    const d2 = unitUtils.convertDistance(target.distanceValue, target.distanceUnit, 'meters');

    // Calculate time to travel distance at input pace
    result.time = paceUtils.calculateTime(d1, input.time, d2);
  } else {
    // Calculate distance traveled in time at input pace
    const d2 = paceUtils.calculateDistance(input.time, d1, target.time);

    // Convert output distance into default distance unit
    const units = unitUtils.getDefaultDistanceUnit(defaultUnitSystem);
    result.distanceValue = unitUtils.convertDistance(d2, 'meters', units);
    result.distanceUnit = units;
  }

  // Return result
  return formatDistTimeResult(result, defaultUnitSystem);
}

/**
 * Predict race results from a target
 * @param {Object} input The input race
 * @param {Object} target The race target
 * @param {Object} options The race prediction options
 * @param {String} defaultUnitSystem The default unit system (imperial or metric)
 * @returns {Object} The result
 */
function calculateRaceResults(input, target, options, defaultUnitSystem) {
  const result = {
    distanceValue: target.distanceValue,
    distanceUnit: target.distanceUnit,
    time: target.time,
    result: target.type === 'distance' ? 'time' : 'distance',
  };

  const d1 = unitUtils.convertDistance(input.distanceValue, input.distanceUnit, 'meters');

  // Add missing value to result
  if (target.type === 'distance') {
    // Convert target distance into meters
    const d2 = unitUtils.convertDistance(target.distanceValue, target.distanceUnit, 'meters');

    // Get prediction
    result.time = raceUtils.predictTime(d1, input.time, d2, options.model, options.riegelExponent);
  } else {
    // Get prediction
    let distance = raceUtils.predictDistance(input.time, d1, target.time, options.model,
      options.riegelExponent);

    // Convert output distance into default distance unit
    distance = unitUtils.convertDistance(distance, 'meters',
      unitUtils.getDefaultDistanceUnit(defaultUnitSystem));

    // Update result
    result.distanceValue = distance;
    result.distanceUnit = unitUtils.getDefaultDistanceUnit(defaultUnitSystem);
  }

  // Return result
  return formatDistTimeResult(result, defaultUnitSystem);
}

/**
 * Calculate race statistics from an input race
 * @param {Object} input The input race
 * @returns {Object} The race statistics
 */
function calculateRaceStats(input) {
  const d1 = unitUtils.convertDistance(input.distanceValue, input.distanceUnit, 'meters');

  return {
    purdyPoints: raceUtils.getPurdyPoints(d1, input.time),
    vo2Max: raceUtils.getVO2Max(d1, input.time),
    vo2: raceUtils.getVO2(d1, input.time),
    vo2MaxPercentage: raceUtils.getVO2Percentage(input.time) * 100,
  }
}

export default {
  calculatePaceResults,
  calculateRaceResults,
  calculateRaceStats,
};
