import paceUtils from '@/utils/paces';
import raceUtils from '@/utils/races';
import unitUtils from '@/utils/units';

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
    result: target.result,
  };

  const pace = paceUtils.getPace(unitUtils.convertDistance(input.distanceValue, input.distanceUnit,
    'meters'), input.time);

  // Add missing value to result
  if (target.result === 'time') {
    // Convert target distance into meters
    const d2 = unitUtils.convertDistance(target.distanceValue, target.distanceUnit, 'meters');

    // Calculate time to travel distance at input pace
    const time = paceUtils.getTime(pace, d2);

    // Update result
    result.time = time;
  } else {
    // Calculate distance traveled in time at input pace
    let distance = paceUtils.getDistance(pace, target.time);

    // Convert output distance into default distance unit
    distance = unitUtils.convertDistance(distance, 'meters',
      unitUtils.getDefaultDistanceUnit(defaultUnitSystem));

    // Update result
    result.distanceValue = distance;
    result.distanceUnit = unitUtils.getDefaultDistanceUnit(defaultUnitSystem);
  }

  // Return result
  return result;
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
    result: target.result,
  };

  const d1 = unitUtils.convertDistance(input.distanceValue, input.distanceUnit, 'meters');

  // Add missing value to result
  if (target.result === 'time') {
    // Convert target distance into meters
    const d2 = unitUtils.convertDistance(target.distanceValue, target.distanceUnit, 'meters');

    // Get prediction
    let time;
    switch (options.model) {
      default:
      case 'AverageModel':
        time = raceUtils.AverageModel.predictTime(d1, input.time, d2,
          options.riegelExponent);
        break;
      case 'PurdyPointsModel':
        time = raceUtils.PurdyPointsModel.predictTime(d1, input.time, d2);
        break;
      case 'VO2MaxModel':
        time = raceUtils.VO2MaxModel.predictTime(d1, input.time, d2);
        break;
      case 'RiegelModel':
        time = raceUtils.RiegelModel.predictTime(d1, input.time, d2,
          options.riegelExponent);
        break;
      case 'CameronModel':
        time = raceUtils.CameronModel.predictTime(d1, input.time, d2);
        break;
    }

    // Update result
    result.time = time;
  } else {
    // Get prediction
    let distance;
    switch (options.model) {
      default:
      case 'AverageModel':
        distance = raceUtils.AverageModel.predictDistance(input.time, d1, target.time,
          options.riegelExponent);
        break;
      case 'PurdyPointsModel':
        distance = raceUtils.PurdyPointsModel.predictDistance(input.time, d1,
          target.time);
        break;
      case 'VO2MaxModel':
        distance = raceUtils.VO2MaxModel.predictDistance(input.time, d1, target.time);
        break;
      case 'RiegelModel':
        distance = raceUtils.RiegelModel.predictDistance(input.time, d1, target.time,
          options.riegelExponent);
        break;
      case 'CameronModel':
        distance = raceUtils.CameronModel.predictDistance(input.time, d1, target.time);
        break;
    }

    // Convert output distance into default distance unit
    distance = unitUtils.convertDistance(distance, 'meters',
      unitUtils.getDefaultDistanceUnit(defaultUnitSystem));

    // Update result
    result.distanceValue = distance;
    result.distanceUnit = unitUtils.getDefaultDistanceUnit(defaultUnitSystem);
  }

  // Return result
  return result;
}

/**
 * Calculate race statistics from an input race
 * @param {Object} input The input race
 * @returns {Object} The race statistics
 */
function calculateRaceStats(input) {
  const d1 = unitUtils.convertDistance(input.distanceValue, input.distanceUnit, 'meters');

  return {
    purdyPoints: raceUtils.PurdyPointsModel.getPurdyPoints(d1, input.time),
    vo2Max: raceUtils.VO2MaxModel.getVO2Max(d1, input.time),
    vo2: raceUtils.VO2MaxModel.getVO2(d1, input.time),
    vo2MaxPercentage: raceUtils.VO2MaxModel.getVO2Percentage(input.time) * 100,
  }
}

export default {
  calculatePaceResults,
  calculateRaceResults,
  calculateRaceStats,
};
