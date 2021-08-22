/**
 * Predict a race time using Pete Riegel's Formula
 * https://en.wikipedia.org/wiki/Peter_Riegel
 * @param {Number} d1 The distance of the input race (in meters)
 * @param {Number} t1 The finish time of the input race (in seconds)
 * @param {Number} d2 The distance of the output race (in meters)
 * @param {Number} c The value of the exponent in the equation
 * @returns {Number} The predicted time for the output race (in seconds)
 */
function RiegelFormula(d1, t1, d2, c = 1.06) {
  return t1 * ((d2 / d1) ** c);
}

/**
 * Predict a race time using Dave Cameron's Formula
 * https://www.cs.uml.edu/~phoffman/cammod.html
 * @param {Number} d1 The distance of the input race (in meters)
 * @param {Number} t1 The finish time of the input race (in seconds)
 * @param {Number} d2 The distance of the output race (in meters)
 * @returns {Number} The predicted time for the output race (in seconds)
 */
function CameronFormula(d1, t1, d2) {
  const a = 13.49681 - (0.000030363 * d1) + (835.7114 / (d1 ** 0.7905));
  const b = 13.49681 - (0.000030363 * d2) + (835.7114 / (d2 ** 0.7905));
  return (t1 / d1) * (a / b) * d2;
}

/**
 * Predict a race time by averaging the results of different formulas
 * @param {Number} d1 The distance of the input race (in meters)
 * @param {Number} t1 The finish time of the input race (in seconds)
 * @param {Number} d2 The distance of the output race (in meters)
 * @param {Number} c The value of the exponent in Pete Riegel's Formula
 * @returns {Number} The predicted time for the output race (in seconds)
 */
function AverageFormula(d1, t1, d2, c = 1.06) {
  const riegel = RiegelFormula(d1, t1, d2, c);
  const cameron = CameronFormula(d1, t1, d2);
  return (riegel + cameron) / 2;
}

export default {
  RiegelFormula,
  CameronFormula,
  AverageFormula,
};
