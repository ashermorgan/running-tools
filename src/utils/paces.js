/**
 * Calculate time from a distance and input pace
 * @param {Number} d1 The input pace distance (in any unit)
 * @param {Number} t1 The input pace time (in seconds)
 * @param {Number} d2 The output distance (in the same unit as d1)
 * @returns {Number} The output time (in seconds)
 */
export function calculateTime(d1, t1, d2) {
  return (t1 / d1) * d2
}

/**
 * Calculate distance from a time and input pace
 * @param {Number} t1 The input pace time (in seconds)
 * @param {Number} d1 The input pace distance (in any unit)
 * @param {Number} t2 The output time (in seconds)
 * @returns {Number} The output distance (in the same unit as d1)
 */
export function calculateDistance(t1, d1, t2) {
  return (d1 / t1) * t2
}
