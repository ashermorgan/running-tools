import { describe, test, expect } from 'vitest';
import * as calculators from '@/core/calculators';

describe('calculatePaceResults method', () => {
  test('should correctly calculate pace times', () => {
    const input = {
      distanceValue: 1,
      distanceUnit: 'kilometers',
      time: 100,
    };
    const target = {
      distanceValue: 20,
      distanceUnit: 'meters',
      type: 'distance',
    };

    const result = calculators.calculatePaceResults(input, target, 'metric', true);

    expect(result).to.deep.equal({
      key: '20 m',
      value: '0:02.00',
      pace: '1:40 / km',
      result: 'value',
      sort: 2,
    });
  });

  test('should correctly calculate pace distances according to default units setting', () => {
    const input = {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 1200,
    };
    const target = {
      time: 600,
      type: 'time',
    };

    const result1 = calculators.calculatePaceResults(input, target, 'metric', true);
    const result2 = calculators.calculatePaceResults(input, target, 'imperial', true);

    expect(result1.key).to.equal('1.61 km');
    expect(result1.value).to.equal('10:00');
    expect(result1.pace).to.equal('6:13 / km');
    expect(result1.result).to.equal('key');
    expect(result1.sort).to.be.closeTo(600, 0.01);

    expect(result2.key).to.equal('1.00 mi');
    expect(result2.value).to.equal('10:00');
    expect(result2.pace).to.equal('10:00 / mi');
    expect(result2.result).to.equal('key');
    expect(result2.sort).to.be.closeTo(600, 0.01);
  });
});

describe('calculateRaceResults method', () => {
  test('should correctly predict race times', () => {
    const input = {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    };
    const target = {
      distanceValue: 10,
      distanceUnit: 'kilometers',
      type: 'distance',
    };
    const racePredictionOptions = {
      model: 'AverageModel',
      riegelExponent: 1.06,
    }

    const result = calculators.calculateRaceResults(input, target, racePredictionOptions,
      'imperial', true);

    expect(result.key).to.equal('10 km');
    expect(result.value).to.equal('41:34.80');
    expect(result.pace).to.equal('6:41 / mi');
    expect(result.result).to.equal('value');
    expect(result.sort).to.be.closeTo(2494.80, 0.01);
  });

  test('should correctly calculate race distances according to default units setting', () => {
    const input = {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    };
    const target = {
      time: 2495,
      type: 'time',
    };
    const racePredictionOptions = {
      model: 'AverageModel',
      riegelExponent: 1.06,
    };

    const result1 = calculators.calculateRaceResults(input, target, racePredictionOptions,
      'metric', true);
    const result2 = calculators.calculateRaceResults(input, target, racePredictionOptions,
      'imperial', true);

    expect(result1.key).to.equal('10.00 km');
    expect(result1.value).to.equal('41:35');
    expect(result1.pace).to.equal('4:09 / km');
    expect(result1.result).to.equal('key');
    expect(result1.sort).to.equal(2495);

    expect(result2.key).to.equal('6.21 mi');
    expect(result2.value).to.equal('41:35');
    expect(result2.pace).to.equal('6:41 / mi');
    expect(result2.result).to.equal('key');
    expect(result2.sort).to.equal(2495);
  });

  test('should correctly predict race times according to race options', () => {
    const input = {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 630,
    };
    const target = {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      type: 'distance',
    };
    const racePredictionOptions = {
      model: 'RiegelModel',
      riegelExponent: 1.12,
    }

    const result = calculators.calculateRaceResults(input, target, racePredictionOptions,
      'imperial', true);

    expect(result.key).to.equal('5 km');
    expect(result.value).to.equal('17:11.78');
    expect(result.pace).to.equal('5:32 / mi');
    expect(result.result).to.equal('value');
    expect(result.sort).to.be.closeTo(1031.77, 0.01);
  });
});

describe('calculateRaceStats method', () => {
  test('should correctly calculate race statistics', () => {
    const input = {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    };

    const results = calculators.calculateRaceStats(input);

    expect(results.purdyPoints).to.be.closeTo(454.5, 0.1);
    expect(results.vo2).to.be.closeTo(47.4, 0.1);
    expect(results.vo2MaxPercentage).to.be.closeTo(95.3, 0.1);
    expect(results.vo2Max).to.be.closeTo(49.8, 0.1);
  });
});

describe('calculateWorkoutResults method', () => {
  test('should correctly calculate distance-based workouts according to race options', () => {
    const input = {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 630,
    };
    const target = {
      distanceValue: 5,
      distanceUnit: 'kilometers', // 5k split is ~17:11.77
      splitValue: 1000,
      splitUnit: 'meters',
      type: 'distance',
    };
    const racePredictionOptions = {
      model: 'RiegelModel',
      riegelExponent: 1.12,
    }

    const result = calculators.calculateWorkoutResults(input, target, racePredictionOptions,
                                                       false, true);

    expect(result.key).to.equal('1000 m @ 5 km');
    expect(result.value).to.equal('3:26.36');
    expect(result.pace).to.equal('');
    expect(result.result).to.equal('value');
    expect(result.sort).to.be.closeTo(206.35, 0.01);
  });

  test('should correctly calculate distance-based workouts according to custom names', () => {
    const input = {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 630,
    };
    const target_1 = {
      distanceValue: 5,
      distanceUnit: 'kilometers', // 5k split is ~17:11.77
      splitValue: 1000,
      splitUnit: 'meters',
      type: 'distance',
      // no custom name
    };
    const target_2 = {
      distanceValue: 5,
      distanceUnit: 'kilometers', // 5k split is ~17:11.77
      splitValue: 1000,
      splitUnit: 'meters',
      type: 'distance',
      customName: 'my custom name',
    };
    const racePredictionOptions = {
      model: 'RiegelModel',
      riegelExponent: 1.12,
    };

    const result1a = calculators.calculateWorkoutResults(input, target_1, racePredictionOptions,
      false, true);
    const result1b = calculators.calculateWorkoutResults(input, target_1, racePredictionOptions,
      true, true);
    const result2a = calculators.calculateWorkoutResults(input, target_2, racePredictionOptions,
      false, true);
    const result2b = calculators.calculateWorkoutResults(input, target_2, racePredictionOptions,
      true, true);

    expect(result1a.key).to.equal('1000 m @ 5 km');
    expect(result1b.key).to.equal('1000 m @ 5 km');
    expect(result2a.key).to.equal('1000 m @ 5 km');
    expect(result2b.key).to.equal('my custom name');
  });

  test('should correctly calculate time-based workouts', () => {
    const input = {
      distanceValue: 5,
      distanceUnit: 'kilometers',
      time: 1200,
    };
    const target = {
      time: 2495, // ~10k split is 41:35
      splitValue: 1,
      splitUnit: 'miles',
      type: 'time',
    };
    const racePredictionOptions = {
      model: 'AverageModel',
      riegelExponent: 1.06,
    }

    const result = calculators.calculateWorkoutResults(input, target, racePredictionOptions, false,
      true);

    expect(result.key).to.equal('1 mi @ 41:35');
    expect(result.value).to.equal('6:41.50');
    expect(result.pace).to.equal('');
    expect(result.result).to.equal('value');
    expect(result.sort).to.be.closeTo(401.50, 0.01);
  });
});
