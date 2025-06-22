/**
 * The supported time units
 */
export enum TimeUnits {
  Seconds = 'seconds',
  Minutes = 'minutes',
  Hours = 'hours',
}
export const TimeUnitData = {
  [TimeUnits.Seconds]: {
    name: 'Seconds',
    symbol: 's',
    value: 1,
  },
  [TimeUnits.Minutes]: {
    name: 'Minutes',
    symbol: 'min',
    value: 60,
  },
  [TimeUnits.Hours]: {
    name: 'Hours',
    symbol: 'hr',
    value: 3600,
  },
};

/**
 * The supported distance units
 */
export enum DistanceUnits {
  Meters = 'meters',
  Yards = 'yards',
  Kilometers = 'kilometers',
  Miles = 'miles',
  Marathons = 'marathons',
}
export const DistanceUnitData = {
  [DistanceUnits.Meters]: {
    name: 'Meters',
    symbol: 'm',
    value: 1,
  },
  [DistanceUnits.Yards]: {
    name: 'Yards',
    symbol: 'yd',
    value: 0.9144,
  },
  [DistanceUnits.Kilometers]: {
    name: 'Kilometers',
    symbol: 'km',
    value: 1000,
  },
  [DistanceUnits.Miles]: {
    name: 'Miles',
    symbol: 'mi',
    value: 1609.3499,
  },
  [DistanceUnits.Marathons]: {
    name: 'Marathons',
    symbol: 'Mar',
    value: 42195,
  },
};

/**
 * The supported speed units
 */
export enum SpeedUnits {
  MetersPerSecond = 'meters_per_second',
  KilometersPerHour = 'kilometers_per_hour',
  MilesPerHour = 'miles_per_hour',
}
export const SpeedUnitData = {
  meters_per_second: {
    name: 'Meters per Second',
    symbol: 'm/s',
    value: 1,
  },
  kilometers_per_hour: {
    name: 'Kilometers per Hour',
    symbol: 'kph',
    value: DistanceUnitData[DistanceUnits.Kilometers].value / TimeUnitData[TimeUnits.Hours].value,
  },
  miles_per_hour: {
    name: 'Miles per Hour',
    symbol: 'mph',
    value: DistanceUnitData[DistanceUnits.Miles].value / TimeUnitData[TimeUnits.Hours].value,
  },
};

/**
 * The supported pace units
 */
export enum PaceUnits {
  SecondsPerMeter = 'seconds_per_meter',
  TimePerKilometer = 'seconds_per_kilometer',
  TimePerMile = 'seconds_per_mile',
}
export const PaceUnitData = {
  [PaceUnits.SecondsPerMeter]: {
    name: 'Seconds per Meter',
    symbol: 's/m',
    value: 1,
  },
  [PaceUnits.TimePerKilometer]: {
    name: 'Time per Kilometer',
    symbol: '/ km',
    value: TimeUnitData[TimeUnits.Seconds].value / DistanceUnitData[DistanceUnits.Kilometers].value,
  },
  [PaceUnits.TimePerMile]: {
    name: 'Time per Mile',
    symbol: '/ mi',
    value: TimeUnitData[TimeUnits.Seconds].value / DistanceUnitData[DistanceUnits.Miles].value,
  },
};

export enum UnitSystems {
  Metric = 'metric',
  Imperial = 'imperial',
};

export interface Distance {
  distanceValue: number,
  distanceUnit: DistanceUnits,
}

export interface DistanceTime extends Distance {
  time: number,
}

/**
 * Convert between time units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertTime(inputValue: number, inputUnit: TimeUnits,
                            outputUnit: TimeUnits): number {
  return (inputValue * TimeUnitData[inputUnit].value) / TimeUnitData[outputUnit].value;
}

/**
 * Convert between distance units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertDistance(inputValue: number, inputUnit: DistanceUnits,
                                outputUnit: DistanceUnits): number {
  return (inputValue * DistanceUnitData[inputUnit].value) / DistanceUnitData[outputUnit].value;
}

/**
 * Convert between speed units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertSpeed(inputValue: number, inputUnit: SpeedUnits,
                             outputUnit: SpeedUnits): number {
  return (inputValue * SpeedUnitData[inputUnit].value) / SpeedUnitData[outputUnit].value;
}

/**
 * Convert between pace units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertPace(inputValue: number, inputUnit: PaceUnits,
                            outputUnit: PaceUnits): number {
  return (inputValue * PaceUnitData[inputUnit].value) / PaceUnitData[outputUnit].value;
}

/**
 * Convert between speed and/or pace units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertSpeedPace(inputValue: number, inputUnit: SpeedUnits | PaceUnits,
                                 outputUnit: SpeedUnits | PaceUnits): number {
  // Calculate input speed
  let speed;
  if (inputUnit in PaceUnitData) {
    speed = 1 / (inputValue * PaceUnitData[inputUnit as PaceUnits].value);
  } else {
    speed = inputValue * SpeedUnitData[inputUnit as SpeedUnits].value;
  }

  // Calculate output
  if (outputUnit in PaceUnitData) {
    return (1 / speed) / PaceUnitData[outputUnit as PaceUnits].value;
  }
  return speed / SpeedUnitData[outputUnit as SpeedUnits].value;
}

/**
 * Detect the user's default unit system
 * @returns {UnitSystems} The default unit system
 */
export function detectDefaultUnitSystem(): UnitSystems {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const language = (navigator.language || (navigator as any).userLanguage).toLowerCase();
  if (language.endsWith('-us') || language.endsWith('-mm')) {
    return UnitSystems.Imperial;
  }
  return UnitSystems.Metric;
}

/**
 * Get the default distance unit in a unit system
 * @param {UnitSystems} unitSystem The unit system
 * @returns {DistanceUnits} The default distance unit
 */
export function getDefaultDistanceUnit(unitSystem: UnitSystems): DistanceUnits {
  return unitSystem === UnitSystems.Metric ? DistanceUnits.Kilometers : DistanceUnits.Miles;
}

/**
 * Get the default speed unit in a unit system
 * @param {UnitSystems} unitSystem The unit system
 * @returns {SpeedUnits} The default speed unit
 */
export function getDefaultSpeedUnit(unitSystem: UnitSystems): SpeedUnits {
  return unitSystem === UnitSystems.Metric ? SpeedUnits.KilometersPerHour
    : SpeedUnits.MilesPerHour;
}

/**
 * Get the default pace unit in a unit system
 * @param {UnitSystems} unitSystem The unit system
 * @returns {PaceUnits} The default pace unit
 */
export function getDefaultPaceUnit(unitSystem: UnitSystems): PaceUnits {
  return unitSystem === UnitSystems.Metric ? PaceUnits.TimePerKilometer : PaceUnits.TimePerMile;
}
