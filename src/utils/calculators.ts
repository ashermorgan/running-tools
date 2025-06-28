import { formatDuration, formatNumber } from '@/utils/format';
import * as paceUtils from '@/utils/paces';
import * as raceUtils from '@/utils/races';
import { TargetTypes, workoutTargetToString } from '@/utils/targets';
import type { StandardTarget, WorkoutTarget } from '@/utils/targets';
import { DistanceUnits, DistanceUnitData, UnitSystems, convertDistance,
  getDefaultDistanceUnit } from '@/utils/units';
import type { DistanceTime } from '@/utils/units';

export enum ResultType {
  Key = 'key',
  Value = 'value',
};

interface PreResult {
  distanceValue: number,
  distanceUnit: DistanceUnits,
  result: TargetTypes,
  time: number,
};

export interface TargetResult {
  key: string,
  value: string,
  pace: string,
  result: ResultType,
  sort: number,
};

export interface RaceOptions {
  model: raceUtils.RacePredictionModel,
  riegelExponent: number,
}

export interface RaceStats {
  purdyPoints: number,
  vo2Max: number,
  vo2: number,
  vo2MaxPercentage: number,
}

export interface WorkoutOptions extends RaceOptions {
  customTargetNames: boolean,
}

/**
 * Format a distance/time result as a key/value result
 * @param {PreResult} result The distance/time result
 * @param {UnitSystems} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {TargetResult} The key/value result
 */
export function formatTargetResult(result: PreResult, defaultUnitSystem: UnitSystems,
                                     preciseDurations: boolean = true): TargetResult {
  // Calculate numerical pace
  const pace = result.time / convertDistance(result.distanceValue, result.distanceUnit,
    getDefaultDistanceUnit(defaultUnitSystem));

  return {
    // Convert distance to key string
    key: formatNumber(result.distanceValue, 0, 2, result.result === 'distance') + ' ' +
      DistanceUnitData[result.distanceUnit].symbol,

    // Convert time to time string
    value: formatDuration(result.time, 3, preciseDurations ? 2 : 0, result.result === 'time'),

    // Convert pace to pace string
    pace: formatDuration(pace, 3, 0, true) + ' / '
      + DistanceUnitData[getDefaultDistanceUnit(defaultUnitSystem)].symbol,

    // Convert dist/time result to key/value
    result: result.result === TargetTypes.Time ? ResultType.Value : ResultType.Key,

    // Use time (in seconds) as sort key
    sort: result.time,
  };
}

/**
 * Calculate paces from a target
 * @param {DistanceTime } input The input pace
 * @param {StandardTarget} target The pace target
 * @param {UnitSystems} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {TargetResult} The result
 */
export function calculatePaceResults(input: DistanceTime, target: StandardTarget,
                                     defaultUnitSystem: UnitSystems,
                                     preciseDurations: boolean = true): TargetResult {
  const result: PreResult = {
    distanceValue: 0,
    distanceUnit: DistanceUnits.Meters,
    time: 0,
    result: target.type === TargetTypes.Distance ? TargetTypes.Time : TargetTypes.Distance,
  };

  const d1 = convertDistance(input.distanceValue, input.distanceUnit, DistanceUnits.Meters);

  // Add missing value to result
  if (target.type === 'distance') {
    // Add target distance to result
    result.distanceValue = target.distanceValue;
    result.distanceUnit = target.distanceUnit;

    // Convert target distance into meters
    const d2 = convertDistance(target.distanceValue, target.distanceUnit, DistanceUnits.Meters);

    // Calculate time to travel distance at input pace
    result.time = paceUtils.calculateTime(d1, input.time, d2);
  } else {
    // Add target time to result
    result.time = target.time;

    // Calculate distance traveled in time at input pace
    const d2 = paceUtils.calculateDistance(input.time, d1, target.time);

    // Convert output distance into default distance unit
    const units = getDefaultDistanceUnit(defaultUnitSystem);
    result.distanceValue = convertDistance(d2, DistanceUnits.Meters, units);
    result.distanceUnit = units;
  }

  // Return result
  return formatTargetResult(result, defaultUnitSystem, preciseDurations);
}

/**
 * Predict race results from a target
 * @param {DistanceTime} input The input race
 * @param {StandardTarget} target The race target
 * @param {RaceOptions} options The race prediction options
 * @param {UnitSystems} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {TargetResult} The result
 */
export function calculateRaceResults(input: DistanceTime, target: StandardTarget,
                                     options: RaceOptions, defaultUnitSystem: UnitSystems,
                                     preciseDurations: boolean = true): TargetResult {

  const result: PreResult = {
    distanceValue: 0,
    distanceUnit: DistanceUnits.Meters,
    time: 0,
    result: target.type === TargetTypes.Distance ? TargetTypes.Time : TargetTypes.Distance,
  };

  const d1 = convertDistance(input.distanceValue, input.distanceUnit, DistanceUnits.Meters);

  // Add missing value to result
  if (target.type === 'distance') {
    // Add target distance to result
    result.distanceValue = target.distanceValue;
    result.distanceUnit = target.distanceUnit;

    // Convert target distance into meters
    const d2 = convertDistance(target.distanceValue, target.distanceUnit, DistanceUnits.Meters);

    // Get prediction
    result.time = raceUtils.predictTime(d1, input.time, d2, options.model, options.riegelExponent);
  } else {
    // Add target time to result
    result.time = target.time;

    // Get prediction
    const distance = raceUtils.predictDistance(input.time, d1, target.time, options.model,
      options.riegelExponent);

    // Convert output distance into default distance unit
    const units = getDefaultDistanceUnit(defaultUnitSystem);
    result.distanceValue = convertDistance(distance, DistanceUnits.Meters, units);
    result.distanceUnit = getDefaultDistanceUnit(defaultUnitSystem);
  }

  // Return result
  return formatTargetResult(result, defaultUnitSystem, preciseDurations);
}

/**
 * Calculate race statistics from an input race
 * @param {DistanceTime} input The input race
 * @returns {RaceStats} The race statistics
 */
export function calculateRaceStats(input: DistanceTime): RaceStats {
  const d1 = convertDistance(input.distanceValue, input.distanceUnit, DistanceUnits.Meters);

  return {
    purdyPoints: raceUtils.getPurdyPoints(d1, input.time),
    vo2Max: raceUtils.getVO2Max(d1, input.time),
    vo2: raceUtils.getVO2(d1, input.time),
    vo2MaxPercentage: raceUtils.getVO2Percentage(input.time) * 100,
  }
}

/**
 * Predict workout results from a target
 * @param {DistanceTime} input The input race
 * @param {WorkoutTarget} target The workout target
 * @param {WorkoutOptions} options The workout options
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {TargetResult} The result
 */
export function calculateWorkoutResults(input: DistanceTime, target: WorkoutTarget,
                                        options: WorkoutOptions,
                                        preciseDurations: boolean = true): TargetResult {
  // Initialize distance and time variables
  const d1 = convertDistance(input.distanceValue, input.distanceUnit, DistanceUnits.Meters);
  const t1 = input.time;
  const d3 = convertDistance(target.splitValue, target.splitUnit, DistanceUnits.Meters);
  let d2, t2;

  // Calculate result
  if (target.type === 'distance') {
    // Convert target distance into meters
    d2 = convertDistance(target.distanceValue, target.distanceUnit, DistanceUnits.Meters);

    // Get workout split prediction
    t2 = raceUtils.predictTime(d1, input.time, d2, options.model, options.riegelExponent);
  } else {
    t2 = target.time;

    // Get workout split prediction
    d2 = raceUtils.predictDistance(t1, d1, t2, options.model, options.riegelExponent);
  }
  const t3 = paceUtils.calculateTime(d2, t2, d3);

  // Return result
  return {
    key: (options.customTargetNames && target.customName) || workoutTargetToString(target),
    value: formatDuration(t3, 3, preciseDurations ? 2 : 0, true),
    pace: '', // Pace not used in workout calculator
    result: ResultType.Value,
    sort: t3,
  }
}
