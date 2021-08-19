/**
 * Calculate pace from distance and time
 * @param {Number} distance The distance (in meters)
 * @param {Number} time The time (in seconds)
 * @returns {Number} The pace (in seconds per meter)
 */
function getPace(distance, time) {
  return time / distance;
}

/**
 * Calculate time from pace and distance
 * @param {Number} pace The pace (in seconds per meter)
 * @param {Number} distance The distance (in meters)
 * @returns {Number} The time (in seconds)
 */
function getTime(pace, distance) {
  return pace * distance;
}

/**
 * Calculate distance from pace and time
 * @param {Number} pace The pace (in seconds per meter)
 * @param {Number} time The time (in seconds)
 * @return {Number} The distance (in meters)
 */
function getDistance(pace, time) {
  return time / pace;
}

export default {
  getPace,
  getTime,
  getDistance,
};
