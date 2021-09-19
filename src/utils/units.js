/**
 * The time units
 */
const TIME_UNITS = {
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
const DISTANCE_UNITS = {
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
    symbol: 'marathons',
    value: 42195,
  },
};

/**
 * The speed units
 */
const SPEED_UNITS = {
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
const PACE_UNITS = {
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
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertTime(inputValue, inputUnit, outputUnit) {
  return (inputValue * TIME_UNITS[inputUnit].value) / TIME_UNITS[outputUnit].value;
}

/**
 * Convert between distance units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertDistance(inputValue, inputUnit, outputUnit) {
  return (inputValue * DISTANCE_UNITS[inputUnit].value) / DISTANCE_UNITS[outputUnit].value;
}

/**
 * Convert between speed units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertSpeed(inputValue, inputUnit, outputUnit) {
  return (inputValue * SPEED_UNITS[inputUnit].value) / SPEED_UNITS[outputUnit].value;
}

/**
 * Convert between pace units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertPace(inputValue, inputUnit, outputUnit) {
  return (inputValue * PACE_UNITS[inputUnit].value) / PACE_UNITS[outputUnit].value;
}

/**
 * Convert between speed and/or pace units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertSpeedPace(inputValue, inputUnit, outputUnit) {
  // Calculate input speed
  let speed;
  if (inputUnit in PACE_UNITS) {
    speed = 1 / (inputValue * PACE_UNITS[inputUnit].value);
  } else {
    speed = inputValue * SPEED_UNITS[inputUnit].value;
  }

  // Calculate output
  if (outputUnit in PACE_UNITS) {
    return (1 / speed) / PACE_UNITS[outputUnit].value;
  }
  return speed / SPEED_UNITS[outputUnit].value;
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

/**
 * Get the default unit system
 * @returns {String} The default unit system
 */
function getDefaultUnitSystem() {
  const language = (navigator.language || navigator.userLanguage).toLowerCase();
  if (language.endsWith('-us') || language.endsWith('-mm')) {
    return 'imperial';
  }
  return 'metric';
}

/**
 * Get the default distance unit
 * @returns {String} The default distance unit
 */
function getDefaultDistanceUnit() {
  return getDefaultUnitSystem() === 'metric' ? 'kilometers' : 'miles';
}

/**
 * Get the default speed unit
 * @returns {String} The default speed unit
 */
function getDefaultSpeedUnit() {
  return getDefaultUnitSystem() === 'metric' ? 'kilometers_per_hour' : 'miles_per_hour';
}

/**
 * Get the default pace unit
 * @returns {String} The default pace unit
 */
function getDefaultPaceUnit() {
  return getDefaultUnitSystem() === 'metric' ? 'seconds_per_kilometer' : 'seconds_per_mile';
}

export default {
  TIME_UNITS,
  DISTANCE_UNITS,
  SPEED_UNITS,
  PACE_UNITS,

  convertTime,
  convertDistance,
  convertSpeed,
  convertPace,
  convertSpeedPace,

  formatDuration,

  getDefaultUnitSystem,
  getDefaultDistanceUnit,
  getDefaultSpeedUnit,
  getDefaultPaceUnit,
};
