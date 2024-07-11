/**
 * Format a number as a string
 * @param {Number} value The number
 * @param {Number} minPadding The minimum number of digits to show before the decimal point
 * @param {Number} maxDigits The maximum number of digits to show after the decimal point
 * @param {Boolean} extraDigits Whether to show extra zeros after the decimal point
 * @returns {String} The formatted value
 */
export function formatNumber(value, minPadding = 0, maxDigits = 2, extraDigits = true) {
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
 * Format a duration as a string
 * @param {Number} value The duration (in seconds)
 * @param {Number} minPadding The minimum number of digits to show before the decimal point
 * @param {Number} maxDigits The maximum number of digits to show after the decimal point
 * @param {Boolean} extraDigits Whether to show extra zeros after the decimal point
 * @returns {String} The formatted value
 */
export function formatDuration(value, minPadding = 6, maxDigits = 2, extraDigits = true) {
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
