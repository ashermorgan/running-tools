export const enum TIME_UNIT_KEYS {
  seconds = 'seconds',
  minutes = 'minutes',
  hours = 'hours',
}
export const enum DISTANCE_UNIT_KEYS {
  meters = 'meters',
  yards = 'yards',
  kilometers = 'kilometers',
  miles = 'miles',
  marathons = 'marathons',
}
export const enum SPEED_UNIT_KEYS {
  meters_per_second = 'meters_per_second',
  kilometers_per_hour = 'kilometers_per_hour',
  miles_per_hour = 'miles_per_hour',
}
export const enum PACE_UNIT_KEYS {
  seconds_per_meter = 'seconds_per_meter',
  time_per_kilometer = 'seconds_per_kilometer',
  time_per_mile = 'seconds_per_mile',
}

/**
 * The time units
 */
export const TIME_UNITS = {
  seconds: {
    name: 'Seconds',
    symbol: 's',
    value: 1,
  },
  minutes: {
    name: 'Minutes',
    symbol: 'min',
    value: 60,
  },
  hours: {
    name: 'Hours',
    symbol: 'hr',
    value: 3600,
  },
};

/**
 * The distance units
 */
export const DISTANCE_UNITS = {
  meters: {
    name: 'Meters',
    symbol: 'm',
    value: 1,
  },
  yards: {
    name: 'Yards',
    symbol: 'yd',
    value: 0.9144,
  },
  kilometers: {
    name: 'Kilometers',
    symbol: 'km',
    value: 1000,
  },
  miles: {
    name: 'Miles',
    symbol: 'mi',
    value: 1609.3499,
  },
  marathons: {
    name: 'Marathons',
    symbol: 'Mar',
    value: 42195,
  },
};

/**
 * The speed units
 */
export const SPEED_UNITS = {
  meters_per_second: {
    name: 'Meters per Second',
    symbol: 'm/s',
    value: 1,
  },
  kilometers_per_hour: {
    name: 'Kilometers per Hour',
    symbol: 'kph',
    value: DISTANCE_UNITS.kilometers.value / TIME_UNITS.hours.value,
  },
  miles_per_hour: {
    name: 'Miles per Hour',
    symbol: 'mph',
    value: DISTANCE_UNITS.miles.value / TIME_UNITS.hours.value,
  },
};

/**
 * The value of each pace unit in seconds per meter
 */
export const PACE_UNITS = {
  seconds_per_meter: {
    name: 'Seconds per Meter',
    symbol: 's/m',
    value: 1,
  },
  seconds_per_kilometer: {
    name: 'Time per Kilometer',
    symbol: '/ km',
    value: TIME_UNITS.seconds.value / DISTANCE_UNITS.kilometers.value,
  },
  seconds_per_mile: {
    name: 'Time per Mile',
    symbol: '/ mi',
    value: TIME_UNITS.seconds.value / DISTANCE_UNITS.miles.value,
  },
};

/**
 * Convert between time units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertTime(inputValue: number, inputUnit: TIME_UNIT_KEYS,
                            outputUnit: TIME_UNIT_KEYS): number {
  return (inputValue * TIME_UNITS[inputUnit].value) / TIME_UNITS[outputUnit].value;
}

/**
 * Convert between distance units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertDistance(inputValue: number, inputUnit: DISTANCE_UNIT_KEYS,
                                outputUnit: DISTANCE_UNIT_KEYS): number {
  return (inputValue * DISTANCE_UNITS[inputUnit].value) / DISTANCE_UNITS[outputUnit].value;
}

/**
 * Convert between speed units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertSpeed(inputValue: number, inputUnit: SPEED_UNIT_KEYS,
                             outputUnit: SPEED_UNIT_KEYS): number {
  return (inputValue * SPEED_UNITS[inputUnit].value) / SPEED_UNITS[outputUnit].value;
}

/**
 * Convert between pace units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertPace(inputValue: number, inputUnit: PACE_UNIT_KEYS,
                            outputUnit: PACE_UNIT_KEYS): number {
  return (inputValue * PACE_UNITS[inputUnit].value) / PACE_UNITS[outputUnit].value;
}

/**
 * Convert between speed and/or pace units
 * @param {number} inputValue The input value
 * @param {string} inputUnit The unit of the input
 * @param {string} outputUnit The unit of the output
 * @returns {number} The output
 */
export function convertSpeedPace(inputValue: number, inputUnit: SPEED_UNIT_KEYS | PACE_UNIT_KEYS,
                                 outputUnit: SPEED_UNIT_KEYS | PACE_UNIT_KEYS): number {
  // Calculate input speed
  let speed;
  if (inputUnit in PACE_UNITS) {
    speed = 1 / (inputValue * PACE_UNITS[inputUnit as PACE_UNIT_KEYS].value);
  } else {
    speed = inputValue * SPEED_UNITS[inputUnit as SPEED_UNIT_KEYS].value;
  }

  // Calculate output
  if (outputUnit in PACE_UNITS) {
    return (1 / speed) / PACE_UNITS[outputUnit as PACE_UNIT_KEYS].value;
  }
  return speed / SPEED_UNITS[outputUnit as SPEED_UNIT_KEYS].value;
}

/**
 * Detect the user's default unit system
 * @returns {string} The default unit system
 */
export function detectDefaultUnitSystem(): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const language = (navigator.language || (navigator as any).userLanguage).toLowerCase();
  if (language.endsWith('-us') || language.endsWith('-mm')) {
    return 'imperial';
  }
  return 'metric';
}

/**
 * Get the default distance unit in a unit system
 * @param {string} unitSystem The unit system
 * @returns {string} The default distance unit
 */
export function getDefaultDistanceUnit(unitSystem: string): string {
  return unitSystem === 'metric' ? 'kilometers' : 'miles';
}

/**
 * Get the default speed unit in a unit system
 * @param {string} unitSystem The unit system
 * @returns {string} The default speed unit
 */
export function getDefaultSpeedUnit(unitSystem: string): string {
  return unitSystem === 'metric' ? 'kilometers_per_hour' : 'miles_per_hour';
}

/**
 * Get the default pace unit in a unit system
 * @param {string} unitSystem The unit system
 * @returns {string} The default pace unit
 */
export function getDefaultPaceUnit(unitSystem: string): string {
  return unitSystem === 'metric' ? 'seconds_per_kilometer' : 'seconds_per_mile';
}
