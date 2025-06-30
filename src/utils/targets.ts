import { formatDuration, formatNumber } from '@/utils/format';
import { DistanceUnits, DistanceUnitData, convertDistance } from '@/utils/units';

/*
 * The two basic types of targets: those defined by distance and those defined by time
 */
export enum TargetTypes {
  Distance = 'distance',
  Time = 'time',
};

/*
 * The types for basic standard targets and target sets
 */
interface DistanceTarget {
  type: TargetTypes.Distance,
  distanceValue: number,
  distanceUnit: DistanceUnits,
};
interface TimeTarget {
  type: TargetTypes.Time,
  time: number,
};
export type StandardTarget = DistanceTarget | TimeTarget;
export interface StandardTargetSet {
  name: string,
  targets: Array<StandardTarget>,
};
export interface StandardTargetSets {
  [key: string]: StandardTargetSet,
};

/*
 * The types for split calculator targets and target sets
 */
export type SplitTarget = DistanceTarget & {
  splitTime?: number
};
export interface SplitTargetSet {
  name: string,
  targets: Array<SplitTarget>,
};
export interface SplitTargetSets {
  [key: string]: SplitTargetSet,
};

/*
 * The types for workout calculator targets and target sets
 */
export type WorkoutTarget = StandardTarget & {
  splitValue: number,
  splitUnit: DistanceUnits,
  customName?: string,
};
export interface WorkoutTargetSet {
  name: string,
  targets: Array<WorkoutTarget>,
};
export interface WorkoutTargetSets {
  [key: string]: WorkoutTargetSet,
};

/*
 * The three types of targets sets: standard (pace & race), split, and workout
 */
export enum TargetSetTypes {
  Standard = 'standard',
  Split = 'split',
  Workout = 'workout',
};

/*
 * The types for generic targets and target sets
 */
export type Target = StandardTarget | SplitTarget | WorkoutTarget;
export type TargetSet = StandardTargetSet | SplitTargetSet | WorkoutTargetSet;
export type TargetSets = StandardTargetSets | SplitTargetSets | WorkoutTargetSets;

/**
 * Sort an array of targets
 * @param {Array<Target>} targets The array of targets
 * @returns {Array<Target>} The sorted targets
 */
export function sort(targets: Array<Target>): Array<Target> {
  return [
    ...targets.filter((item) => item.type === TargetTypes.Distance)
      .sort((a, b) => convertDistance(a.distanceValue, a.distanceUnit, DistanceUnits.Meters)
        - convertDistance(b.distanceValue, b.distanceUnit, DistanceUnits.Meters)),

    ...targets.filter((item) => item.type === TargetTypes.Time)
      .sort((a, b) => a.time - b.time),
  ];
}

/**
 * Generate a string description of a workout target
 * @param {WorkoutTarget} target The workout target
 * @return {string} The string description
 */
export function workoutTargetToString(target: WorkoutTarget): string {
  let result = formatNumber(target.splitValue, 0, 2, false) + ' ' +
    DistanceUnitData[target.splitUnit].symbol;
  if (target.type === TargetTypes.Time) {
    result += ' @ ' + formatDuration(target.time, 3, 2, false);
  } else if (target.distanceValue != target.splitValue || target.distanceUnit != target.splitUnit) {
    result += ' @ ' + formatNumber(target.distanceValue, 0, 2, false) + ' ' +
      DistanceUnitData[target.distanceUnit].symbol;
  }
  return result;
}

/*
 * A set of common pace calculator targets
 */
const common_pace_targets: StandardTargetSet = {
  name: 'Common Pace Targets',
  targets: sort([
    { type: TargetTypes.Distance, distanceValue: 100, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 200, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 300, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 400, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 600, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 800, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 1000, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 1200, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 1500, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 1600, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 3200, distanceUnit: DistanceUnits.Meters },

    { type: TargetTypes.Distance, distanceValue: 2, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 3, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 4, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 6, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 8, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 10, distanceUnit: DistanceUnits.Kilometers },

    { type: TargetTypes.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 2, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 3, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 6, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 8, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 10, distanceUnit: DistanceUnits.Miles },

    { type: TargetTypes.Distance, distanceValue: 0.5, distanceUnit: DistanceUnits.Marathons },
    { type: TargetTypes.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Marathons },

    { type: TargetTypes.Time, time: 600 },
    { type: TargetTypes.Time, time: 1800 },
    { type: TargetTypes.Time, time: 3600 },
  ]),
};

/*
 * A set of common race calculator targets
 */
const common_race_targets: StandardTargetSet = {
  name: 'Common Race Targets',
  targets: sort([
    { type: TargetTypes.Distance, distanceValue: 400, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 800, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 1500, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 1600, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 3000, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 3200, distanceUnit: DistanceUnits.Meters },
    { type: TargetTypes.Distance, distanceValue: 2, distanceUnit: DistanceUnits.Miles },

    { type: TargetTypes.Distance, distanceValue: 3, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 6, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 8, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 10, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetTypes.Distance, distanceValue: 15, distanceUnit: DistanceUnits.Kilometers },

    { type: TargetTypes.Distance, distanceValue: 0.5, distanceUnit: DistanceUnits.Marathons },
    { type: TargetTypes.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Marathons },
  ]),
};


/*
 * A set of targets for 5K mile splits
 */
const five_k_mile_splits: SplitTargetSet = {
  name: '5K Mile Splits',
  targets: [
    { type: TargetTypes.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 2, distanceUnit: DistanceUnits.Miles },
    { type: TargetTypes.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Kilometers },
  ],
};

/*
 * A set of common workout calculator targets
 */
const common_workout_targets: WorkoutTargetSet = {
  name: 'Common Workout Targets',
  targets: [
    {
      splitValue: 400, splitUnit: DistanceUnits.Meters,
      type: TargetTypes.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Miles,
    },
    {
      splitValue: 800, splitUnit: DistanceUnits.Meters,
      type: TargetTypes.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Kilometers,
    },
    {
      splitValue: 1600, splitUnit: DistanceUnits.Meters,
      type: TargetTypes.Time, time: 3600,
    },
    {
      splitValue: 1, splitUnit: DistanceUnits.Miles,
      type: TargetTypes.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Marathons,
    },
  ],
};

export const defaultTargetSets: { [key: string]: TargetSet } = {
  '_pace_targets': common_pace_targets,
  '_race_targets': common_race_targets,
  '_split_targets': five_k_mile_splits,
  '_workout_targets': common_workout_targets,
};
