/**
 * The time units
 */
const TIME_UNITS = {
  seconds: 'seconds',
  minutes: 'minutes',
  hours: 'hours',
};

/**
 * The time unit names
 */
const TIME_UNIT_NAMES = {
  seconds: 'Seconds',
  minutes: 'Minutes',
  hours: 'Hours',
};

/**
 * The time unit symbols
 */
const TIME_UNIT_SYMBOLS = {
  seconds: 's',
  minutes: 'min',
  hours: 'hr',
};

/**
 * The value of each time unit in seconds
 */
const TIME_UNIT_VALUES = {
  seconds: 1,
  minutes: 1 * 60,
  hours: 1 * 60 * 60,
};

/**
 * The distance units
 */
const DISTANCE_UNITS = {
  meters: 'meters',
  kilometers: 'kilometers',
  yards: 'yards',
  miles: 'miles',
  marathons: 'marathons',
};

/**
 * The distance unit names
 */
const DISTANCE_UNIT_NAMES = {
  meters: 'Meters',
  kilometers: 'Kilometers',
  yards: 'Yards',
  miles: 'Miles',
  marathons: 'Marathons',
};

/**
 * The distance unit symbols
 */
const DISTANCE_UNIT_SYMBOLS = {
  meters: 'm',
  kilometers: 'km',
  yards: 'yd',
  miles: 'mi',
  marathons: 'marathons',
};

/**
 * The value of each distance unit in meters
 */
const DISTANCE_UNIT_VALUES = {
  meters: 1,
  kilometers: 1000,
  yards: 0.9144,
  miles: 1609.3499,
  marathons: 42195,
};

/**
 * The speed units
 */
const SPEED_UNITS = {
  meters_per_second: 'meters_per_second',
  kilometers_per_hour: 'kilometers_per_hour',
  miles_per_hour: 'miles_per_hour',
};

/**
 * The speed unit names
 */
const SPEED_UNIT_NAMES = {
  meters_per_second: 'Meters per Second',
  kilometers_per_hour: 'Kilometers per Hour',
  miles_per_hour: 'Miles per Hour',
};

/**
 * The speed unit symbols
 */
const SPEED_UNIT_SYMBOLS = {
  meters_per_second: 'm/s',
  kilometers_per_hour: 'kph',
  miles_per_hour: 'mph',
};

/**
 * The value of each speed unit in meters per second
 */
const SPEED_UNIT_VALUES = {
  meters_per_second: 1,
  kilometers_per_hour: DISTANCE_UNIT_VALUES.kilometers / TIME_UNIT_VALUES.hours,
  miles_per_hour: DISTANCE_UNIT_VALUES.miles / TIME_UNIT_VALUES.hours,
};

/**
 * The pace units
 */
const PACE_UNITS = {
  seconds_per_meter: 'seconds_per_meter',
  seconds_per_kilometer: 'seconds_per_kilometer',
  seconds_per_mile: 'seconds_per_mile',
};

/**
 * The pace unit names
 */
const PACE_UNIT_NAMES = {
  seconds_per_meter: 'Seconds per Meter',
  seconds_per_kilometer: 'Time per Kilometer',
  seconds_per_mile: 'Time per Mile',
};

/**
 * The pace unit symbols
 */
const PACE_UNIT_SYMBOLS = {
  seconds_per_meter: 's/m',
  seconds_er_kilometer: '/km',
  seconds_per_mile: '/mi',
};

/**
 * The value of each pace unit in seconds per meter
 */
const PACE_UNIT_VALUES = {
  seconds_per_meter: 1,
  seconds_per_kilometer: TIME_UNIT_VALUES.seconds / DISTANCE_UNIT_VALUES.kilometers,
  seconds_per_mile: TIME_UNIT_VALUES.seconds / DISTANCE_UNIT_VALUES.miles,
};

/**
 * Convert between time units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertTime(inputValue, inputUnits, outputUnits) {
  return (inputValue * TIME_UNIT_VALUES[inputUnits]) / TIME_UNIT_VALUES[outputUnits];
}

/**
 * Convert between distance units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertDistance(inputValue, inputUnits, outputUnits) {
  return (inputValue * DISTANCE_UNIT_VALUES[inputUnits]) / DISTANCE_UNIT_VALUES[outputUnits];
}

/**
 * Convert between speed units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertSpeed(inputValue, inputUnits, outputUnits) {
  return (inputValue * SPEED_UNIT_VALUES[inputUnits]) / SPEED_UNIT_VALUES[outputUnits];
}

/**
 * Convert between pace units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertPace(inputValue, inputUnits, outputUnits) {
  return (inputValue * PACE_UNIT_VALUES[inputUnits]) / PACE_UNIT_VALUES[outputUnits];
}

/**
 * Convert between speed and/or pace units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertSpeedPace(inputValue, inputUnits, outputUnits) {
  // Calculate input speed
  let speed;
  if (inputUnits in PACE_UNIT_VALUES) {
    speed = 1 / (inputValue * PACE_UNIT_VALUES[inputUnits]);
  } else {
    speed = inputValue * SPEED_UNIT_VALUES[inputUnits];
  }

  // Calculate output
  if (outputUnits in PACE_UNIT_VALUES) {
    return (1 / speed) / PACE_UNIT_VALUES[outputUnits];
  }
  return speed / SPEED_UNIT_VALUES[outputUnits];
}

/**
 * Format a duration as a string
 * @param {Number} value The duration (in seconds)
 * @param {Number} padding The number of digits to show before the decimal point
 * @param {Number} digits The number of digits to show after the decimal point
 * @returns {String} The formatted value
 */
function formatDuration(value, padding = 6, digits = 2) {
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
  let fixedPadding = Math.min(padding, 6);

  // Prevent rounding errors
  const fixedValue = parseFloat(Math.abs(value).toFixed(digits));

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
  if (digits === 0) {
    result += seconds.toFixed(digits).padStart(fixedPadding, '0');
  } else {
    result += seconds.toFixed(digits).padStart(fixedPadding + digits + 1, '0');
  }
  return result;
}

export default {
  TIME_UNITS,
  DISTANCE_UNITS,
  SPEED_UNITS,
  PACE_UNITS,

  TIME_UNIT_NAMES,
  DISTANCE_UNIT_NAMES,
  SPEED_UNIT_NAMES,
  PACE_UNIT_NAMES,

  TIME_UNIT_SYMBOLS,
  DISTANCE_UNIT_SYMBOLS,
  SPEED_UNIT_SYMBOLS,
  PACE_UNIT_SYMBOLS,

  convertTime,
  convertDistance,
  convertSpeed,
  convertPace,
  convertSpeedPace,

  formatDuration,
};
