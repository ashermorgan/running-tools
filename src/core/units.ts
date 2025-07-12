/*
 * Implements handling of distance, pace, speed, and time units
 */

/*
 * The type for the data available for each unit
 */
export interface UnitData {
  name: string,
  symbol: string,
  value: number,
};

/*
 * The available time units
 */
export enum TimeUnits {
  Seconds = 'seconds',
  Minutes = 'minutes',
  Hours = 'hours',
};
export const TimeUnitData: { [key in TimeUnits]: UnitData } = {
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

/*
 * The available distance units
 */
export enum DistanceUnits {
  Meters = 'meters',
  Yards = 'yards',
  Kilometers = 'kilometers',
  Miles = 'miles',
  Marathons = 'marathons',
};
export const DistanceUnitData: { [key in DistanceUnits]: UnitData } = {
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
    value: 1609.344,
  },
  [DistanceUnits.Marathons]: {
    name: 'Marathons',
    symbol: 'Mar',
    value: 42195,
  },
};

/*
 * The available speed units
 */
export enum SpeedUnits {
  MetersPerSecond = 'meters_per_second',
  KilometersPerHour = 'kilometers_per_hour',
  MilesPerHour = 'miles_per_hour',
};
export const SpeedUnitData: { [key in SpeedUnits]: UnitData } = {
  [SpeedUnits.MetersPerSecond]: {
    name: 'Meters per Second',
    symbol: 'm/s',
    value: 1,
  },
  [SpeedUnits.KilometersPerHour]: {
    name: 'Kilometers per Hour',
    symbol: 'kph',
    value: DistanceUnitData[DistanceUnits.Kilometers].value / TimeUnitData[TimeUnits.Hours].value,
  },
  [SpeedUnits.MilesPerHour]: {
    name: 'Miles per Hour',
    symbol: 'mph',
    value: DistanceUnitData[DistanceUnits.Miles].value / TimeUnitData[TimeUnits.Hours].value,
  },
};

/*
 * The available pace units
 */
export enum PaceUnits {
  SecondsPerMeter = 'seconds_per_meter',
  TimePerKilometer = 'seconds_per_kilometer',
  TimePerMile = 'seconds_per_mile',
};
export const PaceUnitData: { [key in PaceUnits]: UnitData } = {
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

/*
 * The available speed and pace units
 */
export type SpeedPaceUnits = SpeedUnits | PaceUnits;

/*
 * The type for a distance input
 */
export interface Distance {
  distanceValue: number,
  distanceUnit: DistanceUnits,
};

/*
 * The type for a distance/time input pair
 */
export interface DistanceTime extends Distance {
  time: number,
};

/*
 * The available unit systems
 */
export enum UnitSystems {
  Metric = 'metric',
  Imperial = 'imperial',
};

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
export function convertSpeedPace(inputValue: number, inputUnit: SpeedPaceUnits,
                                 outputUnit: SpeedPaceUnits): number {
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
 * Format a number as a string
 * @param {number} value The number
 * @param {number} minPadding The minimum number of digits to show before the decimal point
 * @param {number} maxDigits The maximum number of digits to show after the decimal point
 * @param {boolean} extraDigits Whether to show extra zeros after the decimal point
 * @returns {string} The formatted number
 */
export function formatNumber(value: number, minPadding: number = 0, maxDigits: number = 2,
                             extraDigits: boolean = true): string {

  // Initialize result
  let result = '';

  // Remove sign
  const negative = value < 0;
  const fixedValue = Math.abs(value);

  // Address edge cases
  if (Number.isNaN(fixedValue)) {
    return 'NaN';
  }
  if (fixedValue === Infinity) {
    return negative ? '-Infinity' : 'Infinity';
  }

  // Convert number to string
  if (extraDigits) {
    result = fixedValue.toFixed(maxDigits);
  } else {
    const power = 10 ** maxDigits;
    result = (Math.round((fixedValue + Number.EPSILON) * power) / power).toString();
  }

  // Add padding
  const currentPadding = result.split('.')[0].length;
  result = result.padStart(result.length - currentPadding + minPadding, '0');

  // Add negative sign
  if (negative) {
    result = `-${result}`;
  }

  // Return result
  return result;
}

/**
 * Format a distance as a string
 * @param {Distance} input The distance
 * @param {boolean} extraDigits Whether to show extra zeros after the decimal point
 * @returns {string} The formatted distance
 */
export function formatDistance(input: Distance, extraDigits: boolean) {
  return formatNumber(input.distanceValue, 0, 2, extraDigits) + ' '
    + DistanceUnitData[input.distanceUnit].symbol;
}

/**
 * Format a duration as a string
 * @param {number} value The duration (in seconds)
 * @param {number} minPadding The minimum number of digits to show before the decimal point
 * @param {number} maxDigits The maximum number of digits to show after the decimal point
 * @param {boolean} extraDigits Whether to show extra zeros after the decimal point
 * @returns {string} The formatted duration
 */
export function formatDuration(value: number, minPadding: number = 6, maxDigits: number = 2,
                               extraDigits: boolean = true): string {
  // Check if value is NaN
  if (Number.isNaN(value)) {
    return 'NaN';
  }

  // Initialize result
  let result = '';

  // Check value sign
  if (value < 0) {
    result += '-';
  }

  // Check if value is valid
  if (Math.abs(value) === Infinity) {
    return `${result}Infinity`;
  }

  // Validate padding
  let fixedPadding = Math.min(minPadding, 6);

  // Prevent rounding errors
  const fixedValue = parseFloat(Math.abs(value).toFixed(maxDigits));

  // Calculate parts
  const hours = Math.floor(fixedValue / 3600);
  const minutes = Math.floor((fixedValue % 3600) / 60);
  const seconds = fixedValue % 60;

  // Format parts
  if (hours !== 0 || fixedPadding >= 5) {
    result += hours.toString().padStart(fixedPadding - 4, '0');
    result += ':';
    fixedPadding = 4;
  }
  if (minutes !== 0 || fixedPadding >= 3) {
    result += minutes.toString().padStart(fixedPadding - 2, '0');
    result += ':';
    fixedPadding = 2;
  }
  result += formatNumber(seconds, fixedPadding, maxDigits, extraDigits);

  // Return result
  return result;
}

/**
 * Calculate the pace of a distance/time pair and format it as a string
 * @param {DistanceTime} input The input distance/time pair
 * @param {PaceUnits} unit The desired pace unit
 * @returns {string} The formatted pace
 */
export function formatPace(input: DistanceTime, unit: PaceUnits) {
  const dist = convertDistance(input.distanceValue, input.distanceUnit, DistanceUnits.Meters);
  const pace = convertPace(input.time / dist, PaceUnits.SecondsPerMeter, unit)
  const result = formatDuration(pace, 3, 0, true) + ' ' + PaceUnitData[unit].symbol;
  return result;
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
