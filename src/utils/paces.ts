/**
 * Calculate time from a distance and input pace
 * @param {number} d1 The input pace distance (in any unit)
 * @param {number} t1 The input pace time (in seconds)
 * @param {number} d2 The output distance (in the same unit as d1)
 * @returns {number} The output time (in seconds)
 */
export function calculateTime(d1: number, t1: number, d2: number): number {
  return (t1 / d1) * d2
}

/**
 * Calculate distance from a time and input pace
 * @param {number} t1 The input pace time (in seconds)
 * @param {number} d1 The input pace distance (in any unit)
 * @param {number} t2 The output time (in seconds)
 * @returns {number} The output distance (in the same unit as d1)
 */
export function calculateDistance(t1: number, d1: number, t2: number): number {
  return (d1 / t1) * t2
}
