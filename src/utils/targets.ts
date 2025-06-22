import { formatDuration, formatNumber } from '@/utils/format';
import { DistanceUnits, DistanceUnitData, convertDistance } from '@/utils/units';

/*
 * Enumeration for the two basic types of targets: those defined by distance vs time
 */
export enum TargetType {
  Distance = 'distance',
  Time = 'time',
};

/**
 * Type for basic distance-defined targets
 */
interface DistanceTarget {
  type: TargetType.Distance,
  distanceValue: number,
  distanceUnit: DistanceUnits,
};

/**
 * Type for basic time-defined targets
 */
interface TimeTarget {
  type: TargetType.Time,
  time: number,
};

/**
 * Type for pace and race calculator targets
 */
export type StandardTarget = DistanceTarget | TimeTarget;

/*
 * Type for pace and race calculator target sets
 */
export interface StandardTargetSet {
  name: string,
  targets: Array<StandardTarget>,
}

/*
 * Type for split calculator targets
 */
export type SplitTarget = DistanceTarget & {
  splitTime?: number
};

/*
 * Type for split calculator target sets
 */
export interface SplitTargetSet {
  name: string,
  targets: Array<SplitTarget>,
}

/*
 * Type for workout calculator targets
 */
export type WorkoutTarget = StandardTarget & {
  splitValue: number,
  splitUnit: DistanceUnits,
  customName?: string,
};

/*
 * Type for workout calculator target sets
 */
export interface WorkoutTargetSet {
  name: string,
  targets: Array<WorkoutTarget>,
}

/*
 * Type for generic targets
 */
export type Target = StandardTarget | SplitTarget | WorkoutTarget;

/**
 * Sort an array of targets
 * @param {Array<Target>} targets The array of targets
 * @returns {Array<Target>} The sorted targets
 */
export function sort(targets: Array<Target>): Array<Target> {
  return [
    ...targets.filter((item) => item.type === TargetType.Distance)
      .sort((a, b) => convertDistance(a.distanceValue, a.distanceUnit, DistanceUnits.Meters)
        - convertDistance(b.distanceValue, b.distanceUnit, DistanceUnits.Meters)),

    ...targets.filter((item) => item.type === TargetType.Time)
      .sort((a, b) => a.time - b.time),
  ];
}

/**
 * Generate a string description of a workout target
 * @param {WorkoutTarget} target The workout target
 * @return {String} The string description
 */
export function workoutTargetToString(target: WorkoutTarget): string {
  let result = formatNumber(target.splitValue, 0, 2, false) + ' ' +
    DistanceUnitData[target.splitUnit].symbol;
  if (target.type === TargetType.Time) {
    result += ' @ ' + formatDuration(target.time, 3, 2, false);
  } else if (target.distanceValue != target.splitValue || target.distanceUnit != target.splitUnit) {
    result += ' @ ' + formatNumber(target.distanceValue, 0, 2, false) + ' ' +
      DistanceUnitData[target.distanceUnit].symbol;
  }
  return result;
}

/**
 * A set of common pace calculator targets
 */
const common_pace_targets: StandardTargetSet = {
  name: 'Common Pace Targets',
  targets: sort([
    { type: TargetType.Distance, distanceValue: 100, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 200, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 300, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 400, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 600, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 800, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 1000, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 1200, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 1500, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 1600, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 3200, distanceUnit: DistanceUnits.Meters },

    { type: TargetType.Distance, distanceValue: 2, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 3, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 4, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 6, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 8, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 10, distanceUnit: DistanceUnits.Kilometers },

    { type: TargetType.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 2, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 3, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 6, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 8, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 10, distanceUnit: DistanceUnits.Miles },

    { type: TargetType.Distance, distanceValue: 0.5, distanceUnit: DistanceUnits.Marathons },
    { type: TargetType.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Marathons },

    { type: TargetType.Time, time: 600 },
    { type: TargetType.Time, time: 1800 },
    { type: TargetType.Time, time: 3600 },
  ]),
};

/**
 * A set of common race calculator targets
 */
const common_race_targets: StandardTargetSet = {
  name: 'Common Race Targets',
  targets: sort([
    { type: TargetType.Distance, distanceValue: 400, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 800, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 1500, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 1600, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 3000, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 3200, distanceUnit: DistanceUnits.Meters },
    { type: TargetType.Distance, distanceValue: 2, distanceUnit: DistanceUnits.Miles },

    { type: TargetType.Distance, distanceValue: 3, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 6, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 8, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 10, distanceUnit: DistanceUnits.Kilometers },
    { type: TargetType.Distance, distanceValue: 15, distanceUnit: DistanceUnits.Kilometers },

    { type: TargetType.Distance, distanceValue: 0.5, distanceUnit: DistanceUnits.Marathons },
    { type: TargetType.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Marathons },
  ]),
};


/**
 * A set of targets for 5K mile splits
 */
const five_k_mile_splits: SplitTargetSet = {
  name: '5K Mile Splits',
  targets: [
    { type: TargetType.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 2, distanceUnit: DistanceUnits.Miles },
    { type: TargetType.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Kilometers },
  ],
};

/**
 * A set of common workout calculator targets
 */
const common_workout_targets: WorkoutTargetSet = {
  name: 'Common Workout Targets',
  targets: [
    {
      splitValue: 400, splitUnit: DistanceUnits.Meters,
      type: TargetType.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Miles,
    },
    {
      splitValue: 800, splitUnit: DistanceUnits.Meters,
      type: TargetType.Distance, distanceValue: 5, distanceUnit: DistanceUnits.Kilometers,
    },
    {
      splitValue: 1600, splitUnit: DistanceUnits.Meters,
      type: TargetType.Time, time: 3600,
    },
    {
      splitValue: 1, splitUnit: DistanceUnits.Miles,
      type: TargetType.Distance, distanceValue: 1, distanceUnit: DistanceUnits.Marathons,
    },
  ],
};

export const defaultTargetSets = {
  _pace_targets: common_pace_targets,
  _race_targets: common_race_targets,
  _split_targets: five_k_mile_splits,
  _workout_targets: common_workout_targets,
};
