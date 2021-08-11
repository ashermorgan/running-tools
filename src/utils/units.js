/**
 * The time units
 */
const TIME_UNITS = {
  second: 'second',
  minute: 'minute',
  hour: 'hour',
};



/**
 * The value of each time unit in seconds
 */
const TIME_UNIT_VALUES = {
  second: 1,
  minute: 1 * 60,
  hour:   1 * 60 * 60,
};



/**
 * The distance units
 */
const DISTANCE_UNITS = {
  meter: 'meter',
  kilometer: 'kilometer',
  yard: 'yard',
  mile: 'mile',
  marathon: 'marathon',
};



/**
 * The value of each distance unit in meters
 */
const DISTANCE_UNIT_VALUES = {
  meter:      1,
  kilometer:  1000,
  yard:       0.9144,
  mile:       1609.3499,
  marathon:   42195,
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
 * The value of each speed unit in meters per second
 */
const SPEED_UNIT_VALUES = {
  meters_per_second:    1,
  kilometers_per_hour:  DISTANCE_UNIT_VALUES.kilometer / TIME_UNIT_VALUES.hour,
  miles_per_hour:       DISTANCE_UNIT_VALUES.mile / TIME_UNIT_VALUES.hour,
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
 * The value of each pace unit in seconds per meter
 */
const PACE_UNIT_VALUES = {
  seconds_per_meter:      1,
  seconds_per_kilometer:  TIME_UNIT_VALUES.second / DISTANCE_UNIT_VALUES.kilometer,
  seconds_per_mile:       TIME_UNIT_VALUES.second / DISTANCE_UNIT_VALUES.mile,
};



/**
 * Convert between time units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertTime(inputValue, inputUnits, outputUnits) {
  return inputValue * TIME_UNIT_VALUES[inputUnits] / TIME_UNIT_VALUES[outputUnits];
}



/**
 * Convert between distance units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertDistance(inputValue, inputUnits, outputUnits) {
  return inputValue * DISTANCE_UNIT_VALUES[inputUnits] / DISTANCE_UNIT_VALUES[outputUnits];
}



/**
 * Convert between speed units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertSpeed(inputValue, inputUnits, outputUnits) {
  return inputValue * SPEED_UNIT_VALUES[inputUnits] / SPEED_UNIT_VALUES[outputUnits];
}



/**
 * Convert between pace units
 * @param {Number} inputValue The input value
 * @param {String} inputUnit The unit of the input
 * @param {String} outputUnit The unit of the output
 * @returns {Number} The output
 */
function convertPace(inputValue, inputUnits, outputUnits) {
  return inputValue * PACE_UNIT_VALUES[inputUnits] / PACE_UNIT_VALUES[outputUnits];
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
  if (PACE_UNIT_VALUES.hasOwnProperty(inputUnits)) {
    speed = 1 / (inputValue * PACE_UNIT_VALUES[inputUnits]);
  }
  else {
    speed = inputValue * SPEED_UNIT_VALUES[inputUnits];
  }

  // Calculate output
  if (PACE_UNIT_VALUES.hasOwnProperty(outputUnits)) {
    return (1 / speed) / PACE_UNIT_VALUES[outputUnits];
  }
  else {
    return speed / SPEED_UNIT_VALUES[outputUnits];
  }
}



/**
 * Format a duration as a string
 * @param {Number} value The duration (in seconds)
 * @param {Number} padding The number of digits to show before the decimal point
 * @param {Number} digits The number of digits to show after the decimal point
 * @returns {String} The formatted value
 */
function formatDuration(value, padding=6, digits=2) {
  // Validate padding
  padding = Math.min(padding, 6);

  // Calculate parts
  let hours = Math.floor(value / 3600);
  let minutes = Math.floor((value % 3600) / 60);
  let seconds = value % 60;

  // Format parts
  let result = '';
  if (hours !== 0 || padding >= 5) {
    result += hours.toString().padStart(padding - 4, '0');
    result += ':';
    padding = 4;
  }
  if (minutes !== 0 || padding >= 3) {
    result += minutes.toString().padStart(padding - 2, '0');
    result += ':';
    padding = 2;
  }
  if (digits === 0) {
    result += seconds.toFixed(digits).padStart(padding, '0');
  }
  else {
    result += seconds.toFixed(digits).padStart(padding + digits + 1, '0');
  }
  return result;
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
}
