/**
 * Estimate the point at which a function returns a target value using Newton's Method
 * @param {Number} initialEstimate The initial estimate
 * @param {Number} target The target function output
 * @param {Function} method The function
 * @param {Function} derivative The function derivative
 * @param {Number} precision The acceptable precision
 * @param {Number} iterations The maximum number of iterations
 * @returns {Number} The refined estimate
 */
function NewtonsMethod(initialEstimate, target, method, derivative, precision, iterations = 500) {
  // Initialize estimate
  let estimate = initialEstimate;
  let estimateValue;

  for (let i = 0; i < iterations; i += 1) {
    // Evaluate function at estimate
    estimateValue = method(estimate);

    // Check if estimate is close enough
    if (Math.abs(target - estimateValue) < precision) {
      break;
    }

    // Refine estimate
    estimate -= (estimateValue - target) / derivative(estimate);
  }

  // Return refined estimate
  return estimate;
}

/*
 * Methods that implement the Purdy Points race prediction model
 * https://www.cs.uml.edu/~phoffman/xcinfo3.html
 */
const PurdyPointsModel = {
  /**
   * Predict a race time using the Purdy Points Model
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @returns {Number} The predicted time for the output race in seconds
   */
  predictTime(d1, t1, d2) {
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
  },

  /**
   * Calculate the derivative with respect to distance of the Purdy Points curve at a specific point
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @return {Number} The derivative with respect to distance
   */
  derivative(d1, t1, d2) {
    const result = (85 * d2) / (((2316157 * Math.exp(-(522099 * d2) / 100000000000000)) / 1000000
      + (100789 * Math.exp(-(7068099 * d2) / 1000000000000)) / 25000 + (5234627 * Math.exp(-(410767
      * d2) / 1000000000)) / 10000000 + (860921 * Math.exp(-(411693 * d2) / 250000000)) / 200000
      - (223179 * Math.exp(-(1898079 * d2) / 50000000)) / 20000) * (327 / 5000 - (129 * ((2316157
      * Math.exp(-(522099 * d2) / 100000000000000)) / 1000000 + (100789 * Math.exp(-(7068099 * d2)
      / 1000000000000)) / 25000 + (5234627 * Math.exp(-(410767 * d2) / 1000000000)) / 10000000
      + (860921 * Math.exp(-(411693 * d2) / 250000000)) / 200000 - (223179 * Math.exp(-(1898079
      * d2) / 50000000)) / 20000)) / 50000) * ((85 * (1 - (207 * (327 / 5000 - (129 * ((2316157
      * Math.exp(-(522099 * d2) / 100000000000000)) / 1000000 + (100789 * Math.exp(-(7068099 * d2)
      / 1000000000000)) / 25000 + (5234627 * Math.exp(-(410767 * d2) / 1000000000)) / 10000000
      + (860921 * Math.exp(-(411693 * d2) / 250000000)) / 200000 - (223179 * Math.exp(-(1898079
      * d2) / 50000000)) / 20000)) / 50000)) / 17)) / (327 / 5000 - (129 * ((2316157
      * Math.exp(-(522099 * d2) / 100000000000000)) / 1000000 + (100789 * Math.exp(-(7068099 * d2)
      / 1000000000000)) / 25000 + (5234627 * Math.exp(-(410767 * d2) / 1000000000)) / 10000000
      + (860921 * Math.exp(-(411693 * d2) / 250000000)) / 200000 - (223179 * Math.exp(-(1898079
      * d2) / 50000000)) / 20000)) / 50000) + (85 * (d1 / (((2316157 * Math.exp(-(522099 * d1)
      / 100000000000000)) / 1000000 + (100789 * Math.exp(-(7068099 * d1) / 1000000000000)) / 25000
      + (5234627 * Math.exp(-(410767 * d1) / 1000000000)) / 10000000 + (860921 * Math.exp(-(411693
      * d1) / 250000000)) / 200000 - (223179 * Math.exp(-(1898079 * d1) / 50000000)) / 20000) * t1)
      + (207 * (327 / 5000 - (129 * ((2316157 * Math.exp(-(522099 * d1) / 100000000000000))
      / 1000000 + (100789 * Math.exp(-(7068099 * d1) / 1000000000000)) / 25000 + (5234627
      * Math.exp(-(410767 * d1) / 1000000000)) / 10000000 + (860921 * Math.exp(-(411693 * d1)
      / 250000000)) / 200000 - (223179 * Math.exp(-(1898079 * d1) / 50000000)) / 20000)) / 50000))
      / 17 - 1)) / (327 / 5000 - (129 * ((2316157 * Math.exp(-(522099 * d1) / 100000000000000))
      / 1000000 + (100789 * Math.exp(-(7068099 * d1) / 1000000000000)) / 25000 + (5234627
      * Math.exp(-(410767 * d1) / 1000000000)) / 10000000 + (860921 * Math.exp(-(411693 * d1)
      / 250000000)) / 200000 - (223179 * Math.exp(-(1898079 * d1) / 50000000)) / 20000)) / 50000)));
    return result;
  },

  /**
   * Predict a race distance using the Purdy Points Model
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t2 The finish time of the output race in seconds
   * @returns {Number} The predicted distance for the output race in meters
   */
  predictDistance(t1, d1, t2) {
    // Initialize estimate
    let estimate = (d1 * t2) / t1;

    // Refine estimate
    const method = (x) => this.predictTime(d1, t1, x);
    const derivative = (x) => this.derivative(d1, t1, x) / 100; // Derivative on its own is too slow
    estimate = NewtonsMethod(estimate, t2, method, derivative, 0.01);

    // Return estimate
    return estimate;
  },
};

/*
 * Methods that implement the VO2 Max race prediction model
 * http://run-down.com/statistics/calcs_explained.php
 */
const VO2MaxModel = {
  /**
   * Calculate a runner's VO2 max from their performance in a race
   * @param {Number} d The race distance in meters
   * @param {Number} t The finish time in minutes
   * @returns {Number} The runner's VO2 max
   */
  VO2Max(d, t) {
    const v = d / t;
    const result = (-4.6 + (0.182 * v) + (0.000104 * (v ** 2)))
      / (0.8 + (0.189 * Math.exp(-0.0128 * t)) + (0.299 * Math.exp(-0.193 * t)));
    return result;
  },

  /**
   * Calculate the derivative with respect to time of the VO2 max curve at a specific point
   * @param {Number} d The race distance in meters
   * @param {Number} t The finish time in minutes
   * @return {Number} The derivative with respect to time
   */
  VO2MaxTimeDerivative(d, t) {
    const result = -((-575000 * (t ** 2)) + (22750 * d * t) + (13 * (d ** 2))) / (125
      * (t ** 2) * (189 * Math.exp((-8 * t) / 625) + (299 * Math.exp((-193 * t) / 1000) + 800)));
    return result;
  },

  /**
   * Predict a race time using the VO2 Max Model
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @returns {Number} The predicted time for the output race in seconds
   */
  predictTime(d1, t1, d2) {
    // Calculate input VO2 max
    const inputVO2 = this.VO2Max(d1, t1 / 60);

    // Initialize estimate
    let estimate = (t1 * d2) / (d1 * 60);

    // Refine estimate
    const method = (x) => this.VO2Max(d2, x);
    const derivative = (x) => this.VO2MaxTimeDerivative(d2, x);
    estimate = NewtonsMethod(estimate, inputVO2, method, derivative, 0.0001);

    // Return estimate
    return estimate * 60;
  },

  /**
   * Calculate the derivative with respect to distance of the VO2 max curve at a specific point
   * @param {Number} d The race distance in meters
   * @param {Number} t The finish time in minutes
   * @return {Number} The derivative with respect to distance
   */
  VO2MaxDistanceDerivative(d, t) {
    const result = ((26 * d) + (22750 * t)) / (125 * (t ** 2) * ((189 * Math.exp(-(8 * t) / 625))
      + (299 * Math.exp(-(193 * t) / 1000)) + 800));
    return result;
  },

  /**
   * Predict a race distance using the VO2 Max Model
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t2 The finish time of the output race in seconds
   * @returns {Number} The predicted distance for the output race in meters
   */
  predictDistance(t1, d1, t2) {
    // Calculate input VO2 max
    const inputVO2 = this.VO2Max(d1, t1 / 60);

    // Initialize estimate
    let estimate = (d1 * t2) / t1;

    // Refine estimate
    const method = (x) => this.VO2Max(x, t2 / 60);
    const derivative = (x) => this.VO2MaxDistanceDerivative(x, t2 / 60);
    estimate = NewtonsMethod(estimate, inputVO2, method, derivative, 0.0001);

    // Return estimate
    return estimate;
  },
};

/*
 * Methods that implement Dave Cameron's race prediction model
 * https://www.cs.uml.edu/~phoffman/cammod.html
 */
const CameronModel = {
  /**
   * Predict a race time using Dave Cameron's Model
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @returns {Number} The predicted time for the output race in seconds
   */
  predictTime(d1, t1, d2) {
    const a = 13.49681 - (0.000030363 * d1) + (835.7114 / (d1 ** 0.7905));
    const b = 13.49681 - (0.000030363 * d2) + (835.7114 / (d2 ** 0.7905));
    return (t1 / d1) * (a / b) * d2;
  },

  /**
   * Calculate the derivative with respect to distance of the Cameron curve at a specific point
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @return {Number} The derivative with respect to distance
   */
  derivative(d1, t1, d2) {
    const result = -(100 * (30363 * (d1 ** (3581 / 2000)) - 13496810000 * (d1 ** (1581 / 2000))
      - 835711400000) * t1 * (134968100 * (d2 ** (3581 / 2000)) + 14963412617 * d2)) / ((d1 ** (3581
      / 2000)) * (d2 ** (419 / 2000)) * ((30363 * (d2 ** (3581 / 2000)) - 13496810000 * (d2 ** (1581
      / 2000)) - 835711400000) ** 2));
    return result;
  },

  /**
   * Predict a race distance using Dave Cameron's Model
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t2 The finish time of the output race in seconds
   * @returns {Number} The predicted distance for the output race in meters
   */
  predictDistance(t1, d1, t2) {
    // Initialize estimate
    let estimate = (d1 * t2) / t1;

    // Refine estimate
    const method = (x) => this.predictTime(d1, t1, x);
    const derivative = (x) => this.derivative(d1, t1, x);
    estimate = NewtonsMethod(estimate, t2, method, derivative, 0.01);

    // Return estimate
    return estimate;
  },
};

/*
 * Methods that implement Pete Riegel's race prediction model
 * https://en.wikipedia.org/wiki/Peter_Riegel
 */
const RiegelModel = {
  /**
   * Predict a race time using Pete Riegel's Model
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @param {Number} c The value of the exponent in the equation
   * @returns {Number} The predicted time for the output race in seconds
   */
  predictTime(d1, t1, d2, c = 1.06) {
    return t1 * ((d2 / d1) ** c);
  },

  /**
   * Predict a race distance using Pete Riegel's Model
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t2 The finish time of the output race in seconds
   * @param {Number} c The value of the exponent in the equation
   * @returns {Number} The predicted distance for the output race in meters
   */
  predictDistance(t1, d1, t2, c = 1.06) {
    return d1 * ((t2 / t1) ** (1 / c));
  },
};

/*
 * Methods that average the results of different race prediction models
 */
const AverageModel = {
  /**
   * Predict a race time by averaging the results of different models
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @param {Number} c The value of the exponent in Pete Riegel's Model
   * @returns {Number} The predicted time for the output race in seconds
   */
  predictTime(d1, t1, d2, c = 1.06) {
    const purdy = PurdyPointsModel.predictTime(d1, t1, d2);
    const vo2max = VO2MaxModel.predictTime(d1, t1, d2);
    const cameron = CameronModel.predictTime(d1, t1, d2);
    const riegel = RiegelModel.predictTime(d1, t1, d2, c);
    return (purdy + vo2max + cameron + riegel) / 4;
  },

  /**
   * Predict a race distance by averaging the results of different models
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t2 The finish time of the output race in seconds
   * @param {Number} c The value of the exponent in Pete Riegel's Model
   * @returns {Number} The predicted distance for the output race in meters
   */
  predictDistance(t1, d1, t2, c = 1.06) {
    const purdy = PurdyPointsModel.predictDistance(t1, d1, t2);
    const vo2max = VO2MaxModel.predictDistance(t1, d1, t2);
    const cameron = CameronModel.predictDistance(t1, d1, t2);
    const riegel = RiegelModel.predictDistance(t1, d1, t2, c);
    return (purdy + vo2max + cameron + riegel) / 4;
  },
};

export default {
  PurdyPointsModel,
  VO2MaxModel,
  CameronModel,
  RiegelModel,
  AverageModel,
};
