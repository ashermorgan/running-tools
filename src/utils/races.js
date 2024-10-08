/**
 * Estimate the point at which a function returns a target value using Newton's Method
 * @param {Number} initialEstimate The initial estimate
 * @param {Number} target The target function output
 * @param {Function} method The function
 * @param {Function} derivative The function derivative
 * @param {Number} precision The acceptable precision
 * @returns {Number} The refined estimate
 */
function NewtonsMethod(initialEstimate, target, method, derivative, precision) {
  // Initialize estimate
  let estimate = initialEstimate;
  let estimateValue;

  for (let i = 0; i < 500; i += 1) {
    // Evaluate function at estimate
    estimateValue = method(estimate);

    // Check if estimate is close enough (usually occurs way before i = 500)
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
   * Calculate the Purdy Point variables for a distance
   * @param {Number} d The distance in meters
   * @returns {Object} The Purdy Point variables
   */
  getVariables(d) {
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
    const v = (-c1 * Math.exp(-r1 * d))
              + (c2 * Math.exp(-r2 * d))
              + (c3 * Math.exp(-r3 * d))
              + (c4 * Math.exp(-r4 * d))
              + (c5 * Math.exp(-r5 * d));

    // Calculate world record time
    const twsec = d / v;

    // Calculate constants
    const k = 0.0654 - (0.00258 * v);
    const a = 85 / k;
    const b = 1 - (1035 / a);

    // Return Purdy Point variables
    return {
      twsec,
      a,
      b,
    };
  },

  /**
   * Get the Purdy Points for a race
   * @param {Number} d The distance of the race in meters
   * @param {Number} t The finish time of the race in seconds
   * @returns {Number} The Purdy Points for the race
   */
  getPurdyPoints(d, t) {
    // Get variables
    const variables = PurdyPointsModel.getVariables(d);

    // Calculate Purdy Points
    const points = variables.a * ((variables.twsec / t) - variables.b);

    // Return Purdy Points
    return points;
  },

  /**
   * Predict a race time using the Purdy Points Model
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @returns {Number} The predicted time for the output race in seconds
   */
  predictTime(d1, t1, d2) {
    // Calculate Purdy Points for distance 1
    const points = PurdyPointsModel.getPurdyPoints(d1, t1);

    // Calculate time for distance 2
    const variables = PurdyPointsModel.getVariables(d2);
    const seconds = (variables.a * variables.twsec) / (points + (variables.a * variables.b));

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

    // Refine estimate (derivative on its own is too slow)
    const method = (x) => PurdyPointsModel.predictTime(d1, t1, x);
    const derivative = (x) => PurdyPointsModel.derivative(d1, t1, x) / 500;
    estimate = NewtonsMethod(estimate, t2, method, derivative, 0.01);

    // Return estimate
    return estimate;
  },
};

/*
 * Methods that implement the VO2 Max race prediction model
 * http://run-down.com/statistics/calcs_explained.php
 * https://vdoto2.com/Calculator
 */
const VO2MaxModel = {
  /**
   * Calculate the VO2 of a runner during a race
   * @param {Number} d The race distance in meters
   * @param {Number} t The finish time in seconds
   * @returns {Number} The VO2
   */
  getVO2(d, t) {
    const minutes = t / 60;
    const v = d / minutes;
    const result = -4.6 + (0.182258 * v) + (0.000104 * (v ** 2));
    return result;
  },

  /**
   * Calculate the percentage of VO2 max a runner is at during a race
   * @param {Number} t The race time in seconds
   * @returns {Number} The percentage of VO2 max
   */
  getVO2Percentage(t) {
    const minutes = t / 60;
    const result = 0.8 + (0.189439 * Math.exp(-0.012778 * minutes)) + (0.298956 * Math.exp(-0.193261
      * minutes));
    return result;
  },

  /**
   * Calculate a runner's VO2 max from a race result
   * @param {Number} d The race distance in meters
   * @param {Number} t The finish time in seconds
   * @returns {Number} The runner's VO2 max
   */
  getVO2Max(d, t) {
    const result = VO2MaxModel.getVO2(d, t) / VO2MaxModel.getVO2Percentage(t);
    return result;
  },

  /**
   * Calculate the derivative with respect to time of the VO2 max curve at a specific point
   * @param {Number} d The race distance in meters
   * @param {Number} t The finish time in seconds
   * @return {Number} The derivative with respect to time
   */
  VO2MaxTimeDerivative(d, t) {
    const result = (-(273 * d) / (25 * (t ** 2)) - (468 * (d ** 2)) / (625 * (t ** 3))) / ((189
      * Math.exp(-(2 * t) / 9375)) / 1000 + (299 * Math.exp(-(193 * t) / 60000)) / 1000 + 4 / 5)
      - (((273 * d) / (25 * t) + (234 * (d ** 2)) / (625 * (t ** 2)) - 23 / 5) * (-(63
      * Math.exp(-(2 * t) / 9375)) / 1562500 - (57707 * Math.exp(-(193 * t) / 60000)) / 60000000))
      / (((189 * Math.exp(-(2 * t) / 9375)) / 1000 + (299 * Math.exp(-(193 * t) / 60000)) / 1000
      + 4 / 5) ** 2);
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
    const inputVO2Max = VO2MaxModel.getVO2Max(d1, t1);

    // Initialize estimate
    let estimate = (t1 * d2) / d1;

    // Refine estimate
    const method = (x) => VO2MaxModel.getVO2Max(d2, x);
    const derivative = (x) => VO2MaxModel.VO2MaxTimeDerivative(d2, x);
    estimate = NewtonsMethod(estimate, inputVO2Max, method, derivative, 0.0001);

    // Return estimate
    return estimate;
  },

  /**
   * Calculate the derivative with respect to distance of the VO2 max curve at a specific point
   * @param {Number} d The race distance in meters
   * @param {Number} t The finish time in seconds
   * @return {Number} The derivative with respect to distance
   */
  VO2MaxDistanceDerivative(d, t) {
    const result = ((468 * d) / (625 * (t ** 2)) + 273 / (25 * t)) / ((189 * Math.exp(-(2 * t)
      / 9375)) / 1000 + (299 * Math.exp(-(193 * t) / 60000)) / 1000 + 4 / 5);
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
    const inputVO2 = VO2MaxModel.getVO2Max(d1, t1);

    // Initialize estimate
    let estimate = (d1 * t2) / t1;

    // Refine estimate
    const method = (x) => VO2MaxModel.getVO2Max(x, t2);
    const derivative = (x) => VO2MaxModel.VO2MaxDistanceDerivative(x, t2);
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
    const method = (x) => CameronModel.predictTime(d1, t1, x);
    const derivative = (x) => CameronModel.derivative(d1, t1, x);
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

/**
 * Predict a race time
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d2 The distance of the output race in meters
   * @param {String} model The race prediction model to use
   * @param {Number} c The value of the exponent in Pete Riegel's Model
 */
export function predictTime(d1, t1, d2, model='AverageModel', c=1.06) {
  switch (model) {
    case 'AverageModel':
      return AverageModel.predictTime(d1, t1, d2, c);
    case 'PurdyPointsModel':
      return PurdyPointsModel.predictTime(d1, t1, d2);
    case 'VO2MaxModel':
      return VO2MaxModel.predictTime(d1, t1, d2);
    case 'RiegelModel':
      return RiegelModel.predictTime(d1, t1, d2, c);
    case 'CameronModel':
      return CameronModel.predictTime(d1, t1, d2);
  }
}

/**
 * Predict a race distance
   * @param {Number} t1 The finish time of the input race in seconds
   * @param {Number} d1 The distance of the input race in meters
   * @param {Number} t2 The finish time of the output race in seconds
   * @param {String} model The race prediction model to use
   * @param {Number} c The value of the exponent in Pete Riegel's Model
 */
export function predictDistance(t1, d1, t2, model='AverageModel', c=1.06) {
  switch (model) {
    default:
    case 'AverageModel':
      return AverageModel.predictDistance(t1, d1, t2, c);
    case 'PurdyPointsModel':
      return PurdyPointsModel.predictDistance(t1, d1, t2);
    case 'VO2MaxModel':
      return VO2MaxModel.predictDistance(t1, d1, t2);
    case 'RiegelModel':
      return RiegelModel.predictDistance(t1, d1, t2, c);
    case 'CameronModel':
      return CameronModel.predictDistance(t1, d1, t2);
  }
}

export const getPurdyPoints = PurdyPointsModel.getPurdyPoints;
export const getVO2 = VO2MaxModel.getVO2;
export const getVO2Percentage = VO2MaxModel.getVO2Percentage;
export const getVO2Max = VO2MaxModel.getVO2Max;
