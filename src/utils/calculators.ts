import { formatDuration, formatNumber } from '@/utils/format';
import * as paceUtils from '@/utils/paces';
import * as raceUtils from '@/utils/races';
import { TargetTypes, workoutTargetToString } from '@/utils/targets';
import type { StandardTarget, WorkoutTarget } from '@/utils/targets';
import { DistanceUnits, DistanceUnitData, UnitSystems, convertDistance,
  getDefaultDistanceUnit } from '@/utils/units';
import type { DistanceTime } from '@/utils/units';

/*
 * The four main calculators (batch and unit calculators not included)
 *
 * Used to determine available options and target set format
 */
export enum Calculators {
  Pace = 'pace',
  Race = 'race',
  Split = 'split',
  Workout = 'workout',
}

/*
 * The type for the available race statistics
 */
export interface RaceStats {
  purdyPoints: number,
  vo2Max: number,
  vo2: number,
  vo2MaxPercentage: number,
};

/*
 * The type for the options specific to each calculator
 */
export interface StandardOptions {
  selectedTargetSet: string,
}
export interface RaceOptions extends StandardOptions {
  model: raceUtils.RacePredictionModel,
  riegelExponent: number,
};
export interface WorkoutOptions extends RaceOptions {
  customTargetNames: boolean,
};
export type CalculatorOptions = StandardOptions | RaceOptions | WorkoutOptions;

/*
 * The two possible result fields of a target result: "key" and "value"
 */
export enum ResultType {
  Key = 'key',
  Value = 'value',
};

/*
 * The type for target results
 */
export interface TargetResult {
  key: string,
  value: string,
  pace: string,
  result: ResultType,
  sort: number,
};

/**
 * Calculate results for a standard target
 * @param {DistanceTime} input The input pace
 * @param {StandardTarget} target The standard target
 * @param {Function} calculateTime The function for calculating time results
 * @param {Function} calculateDistance The function for calculating distance results
 * @param {UnitSystems} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {TargetResult} The result
 */
function calculateStandardResult(input: DistanceTime, target: StandardTarget,
  calculateTime: (d1: number, t1: number, d2: number) => number,
  calculateDistance: (t1: number, d1: number, t2: number) => number, defaultUnitSystem: UnitSystems,
  preciseDurations: boolean = true): TargetResult {

  let distanceValue, distanceUnit, time;
  const d1 = convertDistance(input.distanceValue, input.distanceUnit, DistanceUnits.Meters);
  if (target.type === TargetTypes.Distance) {
    // Add target distance to result
    distanceValue = target.distanceValue;
    distanceUnit = target.distanceUnit;

    // Calculate time result
    const d2 = convertDistance(target.distanceValue, target.distanceUnit, DistanceUnits.Meters);
    time = calculateTime(d1, input.time, d2);
  } else {
    // Add target time to result
    time = target.time;

    // Calculate distance result
    const d2 = calculateDistance(input.time, d1, target.time);
    const units = getDefaultDistanceUnit(defaultUnitSystem);
    distanceValue = convertDistance(d2, DistanceUnits.Meters, units);
    distanceUnit = units;
  }

  // Calculate numerical pace
  const pace = time / convertDistance(distanceValue, distanceUnit,
    getDefaultDistanceUnit(defaultUnitSystem));

  return {
    // Convert distance to key string
    key: formatNumber(distanceValue, 0, 2, target.type === TargetTypes.Time) + ' ' +
      DistanceUnitData[distanceUnit].symbol,

    // Convert time to time string
    value: formatDuration(time, 3, preciseDurations ? 2 : 0, target.type === TargetTypes.Distance),

    // Convert pace to pace string
    pace: formatDuration(pace, 3, 0, true) + ' / '
      + DistanceUnitData[getDefaultDistanceUnit(defaultUnitSystem)].symbol,

    // Convert dist/time result to key/value
    result: target.type === TargetTypes.Distance ? ResultType.Value : ResultType.Key,

    // Use time (in seconds) as sort key
    sort: time,
  };
}

/**
 * Calculate paces from a target
 * @param {DistanceTime} input The input pace
 * @param {StandardTarget} target The pace target
 * @param {UnitSystems} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {TargetResult} The result
 */
export function calculatePaceResults(input: DistanceTime, target: StandardTarget,
                                     defaultUnitSystem: UnitSystems,
                                     preciseDurations: boolean = true): TargetResult {

  return calculateStandardResult(input, target, (d1, t1, d2) => paceUtils.calculateTime(d1, t1, d2),
    (t1, d1, t2) => paceUtils.calculateDistance(t1, d1, t2), defaultUnitSystem, preciseDurations);
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

  return calculateStandardResult(input, target,
    (d1, t1, d2) => raceUtils.predictTime(d1, t1, d2, options.model, options.riegelExponent),
    (t1, d1, t2) => raceUtils.predictDistance(t1, d1, t2, options.model, options.riegelExponent),
    defaultUnitSystem, preciseDurations);
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
