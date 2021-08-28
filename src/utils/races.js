/**
 * Predict a race time using the Purdy Points Model
 * https://www.cs.uml.edu/~phoffman/xcinfo3.html
 * @param {Number} d1 The distance of the input race in meters
 * @param {Number} t1 The finish time of the input race in seconds
 * @param {Number} d2 The distance of the output race in meters
 * @returns {Number} The predicted time for the output race in seconds
 */
function PurdyPointsModel(d1, t1, d2) {
  // Declare constants
  const c1 = 11.15895;
  const c2 = 4.304605;
  const c3 = 0.5234627;
  const c4 = 4.031560;
  const c5 = 2.316157;
  const r1 = 3.796158e-2;
  const r2 = 1.646772e-3;
  const r3 = 4.107670e-4;
  const r4 = 7.068099e-6;
  const r5 = 5.220990e-9;

  // Calculate world record velocity from running curve
  const v1 = (-c1 * Math.exp(-r1 * d1))
            + (c2 * Math.exp(-r2 * d1))
            + (c3 * Math.exp(-r3 * d1))
            + (c4 * Math.exp(-r4 * d1))
            + (c5 * Math.exp(-r5 * d1));
  const v2 = (-c1 * Math.exp(-r1 * d2))
            + (c2 * Math.exp(-r2 * d2))
            + (c3 * Math.exp(-r3 * d2))
            + (c4 * Math.exp(-r4 * d2))
            + (c5 * Math.exp(-r5 * d2));

  // Calculate world record time
  const twsec1 = d1 / v1;
  const twsec2 = d2 / v2;

  // Calculate constants
  const k1 = 0.0654 - (0.00258 * v1);
  const k2 = 0.0654 - (0.00258 * v2);
  const a1 = 85 / k1;
  const a2 = 85 / k2;
  const b1 = 1 - (1035 / a1);
  const b2 = 1 - (1035 / a2);

  // Calculate Purdy Points for distance 1
  const points = a1 * ((twsec1 / t1) - b1);

  // Calculate time for distance 2
  const seconds = (a2 * twsec2) / (points + (a2 * b2));

  // Return predicted time
  return seconds;
}

/**
 * Calculate a runner's VO2 max from their performance in a race
 * @param {Number} d The race distance in meters
 * @param {Number} t The finish time in minutes
 * @returns {Number} The runner's VO2 max
 */
function VO2Max(d, t) {
  const v = d / t;
  const result = (-4.6 + (0.182 * v) + (0.000104 * (v ** 2)))
    / (0.8 + (0.189 * Math.exp(-0.0128 * t)) + (0.299 * Math.exp(-0.193 * t)));
  return result;
}

/**
 * Calculate the derivative with respect to time of the VO2 max curve at a specific point
 * @param {Number} d The race distance in meters
 * @param {Number} t The finish time in minutes
 * @return {Number} The derivative
 */
function VO2MaxDerivative(d, t) {
  const result = ((-575000 * (t ** 2)) + (22750 * d * t) + (13 * (d ** 2))) / (125
    * (t ** 2) * (189 * Math.exp((-8 * t) / 625) + (299 * Math.exp((-193 * t) / 1000) + 800)));
  return result;
}

/**
 * Predict a race time using the VO2 Max Model
 * http://run-down.com/statistics/calcs_explained.php
 * @param {Number} d1 The distance of the input race in meters
 * @param {Number} t1 The finish time of the input race in seconds
 * @param {Number} d2 The distance of the output race in meters
 * @param {Number} iterations The maximum number of times to refine the prediction
 * @returns {Number} The predicted time for the output race in seconds
 */
function VO2MaxModel(d1, t1, d2, iterations = 500) {
  // Calculate input VO2 max
  const inputVO2 = VO2Max(d1, t1 / 60);

  // Initialize estimate
  let estimate = (t1 * d2) / (d1 * 60);
  let estimateVO2;

  for (let i = 0; i < iterations; i += 1) {
    // Get estimate's VO2 max
    estimateVO2 = VO2Max(d2, estimate);

    // Check if estimate is close enough
    if (Math.abs(inputVO2 - estimateVO2) < 0.0001) {
      break;
    }

    // Refine estimate
    estimate += (estimateVO2 - inputVO2) / VO2MaxDerivative(d2, estimate);
  }

  // Return estimate
  return estimate * 60;
}

/**
 * Predict a race time using Dave Cameron's Model
 * https://www.cs.uml.edu/~phoffman/cammod.html
 * @param {Number} d1 The distance of the input race in meters
 * @param {Number} t1 The finish time of the input race in seconds
 * @param {Number} d2 The distance of the output race in meters
 * @returns {Number} The predicted time for the output race in seconds
 */
function CameronModel(d1, t1, d2) {
  const a = 13.49681 - (0.000030363 * d1) + (835.7114 / (d1 ** 0.7905));
  const b = 13.49681 - (0.000030363 * d2) + (835.7114 / (d2 ** 0.7905));
  return (t1 / d1) * (a / b) * d2;
}

/**
 * Predict a race time using Pete Riegel's Model
 * https://en.wikipedia.org/wiki/Peter_Riegel
 * @param {Number} d1 The distance of the input race in meters
 * @param {Number} t1 The finish time of the input race in seconds
 * @param {Number} d2 The distance of the output race in meters
 * @param {Number} c The value of the exponent in the equation
 * @returns {Number} The predicted time for the output race in seconds
 */
function RiegelModel(d1, t1, d2, c = 1.06) {
  return t1 * ((d2 / d1) ** c);
}

/**
 * Predict a race time by averaging the results of different models
 * @param {Number} d1 The distance of the input race in meters
 * @param {Number} t1 The finish time of the input race in seconds
 * @param {Number} d2 The distance of the output race in meters
 * @param {Number} c The value of the exponent in Pete Riegel's Model
 * @returns {Number} The predicted time for the output race in seconds
 */
function AverageModel(d1, t1, d2, c = 1.06) {
  const purdy = PurdyPointsModel(d1, t1, d2);
  const vo2max = VO2MaxModel(d1, t1, d2);
  const cameron = CameronModel(d1, t1, d2);
  const riegel = RiegelModel(d1, t1, d2, c);
  return (purdy + vo2max + cameron + riegel) / 4;
}

export default {
  PurdyPointsModel,
  VO2MaxModel,
  CameronModel,
  RiegelModel,
  AverageModel,
};
