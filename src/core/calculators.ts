/*
 * Contains types and functions for core calculator functionality
 */

import * as racePrediction from '@/core/racePrediction';
import type { RacePredictionOptions } from '@/core/racePrediction';
import { TargetTypes, workoutTargetToString } from '@/core/targets';
import type { StandardTarget, WorkoutTarget } from '@/core/targets';
import { DistanceUnits, UnitSystems, convertDistance, detectDefaultUnitSystem, formatDistance,
  formatDuration, formatPace, getDefaultDistanceUnit, getDefaultPaceUnit } from '@/core/units';
import type { DistanceTime } from '@/core/units';

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
export interface GlobalOptions {
  defaultUnitSystem: UnitSystems,
  racePredictionOptions: RacePredictionOptions,
};
export interface SplitOptions {
  selectedTargetSet: string,
};
export interface PaceOptions extends SplitOptions {
  input: DistanceTime,
};
export type RaceOptions = PaceOptions;
export interface WorkoutOptions extends PaceOptions {
  customTargetNames: boolean,
};
export interface BatchOptions {
  calculator: Calculators.Pace | Calculators.Race | Calculators.Workout,
  increment: number,
  input: DistanceTime,
  label: string,
  rows: number,
};

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

/*
 * The default input and options for each calculator
 */
export const defaultGlobalOptions: GlobalOptions = {
  defaultUnitSystem: detectDefaultUnitSystem(),
  racePredictionOptions: racePrediction.defaultRacePredictionOptions,
};
export const defaultInput: DistanceTime = {
  distanceValue: 5,
  distanceUnit: DistanceUnits.Kilometers,
  time: 1200,
};
export const defaultBatchOptions: BatchOptions = {
  calculator: Calculators.Workout,
  increment: 15,
  input: defaultInput,
  label: '',
  rows: 20,
};
export const defaultPaceOptions: PaceOptions = {
  input: defaultInput,
  selectedTargetSet: '_pace_targets',
};
export const defaultRaceOptions: RaceOptions = {
  input: defaultInput,
  selectedTargetSet: '_race_targets',
};
export const defaultSplitOptions: SplitOptions = {
  selectedTargetSet: '_split_targets',
};
export const defaultWorkoutOptions: WorkoutOptions = {
  customTargetNames: false,
  input: defaultInput,
  selectedTargetSet: '_workout_targets',
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

  return {
    // Convert distance to key string
    key: formatDistance({ distanceValue, distanceUnit }, target.type === TargetTypes.Time),

    // Convert time to time string
    value: formatDuration(time, 3, preciseDurations ? 2 : 0, target.type === TargetTypes.Distance),

    // Convert pace to pace string
    pace: formatPace({ time, distanceValue, distanceUnit }, getDefaultPaceUnit(defaultUnitSystem)),

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
                                     preciseDurations: boolean): TargetResult {

  return calculateStandardResult(input, target, (d1, t1, d2) => ((t1 / d1) * d2),
    (t1, d1, t2) => ((d1 / t1) * t2), defaultUnitSystem, preciseDurations);
}

/**
 * Predict race results from a target
 * @param {DistanceTime} input The input race
 * @param {StandardTarget} target The race target
 * @param {RacePredictionOptions} racePredictionOptions The race prediction options
 * @param {UnitSystems} defaultUnitSystem The default unit system (imperial or metric)
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {TargetResult} The result
 */
export function calculateRaceResults(input: DistanceTime, target: StandardTarget,
                                     racePredictionOptions: RacePredictionOptions,
                                     defaultUnitSystem: UnitSystems, preciseDurations: boolean
                                    ): TargetResult {

  return calculateStandardResult(input, target,
    (d1, t1, d2) => racePrediction.predictTime(d1, t1, d2, racePredictionOptions),
    (t1, d1, t2) => racePrediction.predictDistance(t1, d1, t2, racePredictionOptions),
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
    purdyPoints: racePrediction.getPurdyPoints(d1, input.time),
    vo2Max: racePrediction.getVO2Max(d1, input.time),
    vo2: racePrediction.getVO2(d1, input.time),
    vo2MaxPercentage: racePrediction.getVO2Percentage(input.time) * 100,
  }
}

/**
 * Predict workout results from a target
 * @param {DistanceTime} input The input race
 * @param {WorkoutTarget} target The workout target
 * @param {RacePredictionOptions} racePredictionOptions The race prediction options
 * @param {Boolean} customTargetNames Whether to use custom target names
 * @param {Boolean} preciseDurations Whether to return precise, unrounded, durations
 * @returns {TargetResult} The result
 */
export function calculateWorkoutResults(input: DistanceTime, target: WorkoutTarget,
                                        racePredictionOptions: RacePredictionOptions,
                                        customTargetNames: boolean, preciseDurations: boolean
                                       ): TargetResult {
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
    t2 = racePrediction.predictTime(d1, input.time, d2, racePredictionOptions);
  } else {
    t2 = target.time;

    // Get workout split prediction
    d2 = racePrediction.predictDistance(t1, d1, t2, racePredictionOptions);
  }
  const t3 = (t2 / d2) * d3;

  // Return result
  return {
    key: (customTargetNames && target.customName) || workoutTargetToString(target),
    value: formatDuration(t3, 3, preciseDurations ? 2 : 0, true),
    pace: '', // Pace not used in workout calculator
    result: ResultType.Value,
    sort: t3,
  }
}
