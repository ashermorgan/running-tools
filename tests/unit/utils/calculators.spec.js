import { test, expect } from 'vitest';
import calculatorUtils from '@/utils/calculators';

test('should correctly calculate pace times', () => {
  const input = {
    distanceValue: 1,
    distanceUnit: 'kilometers',
    time: 100,
  };
  const target = {
    distanceValue: 20,
    distanceUnit: 'meters',
    result: 'time',
  };

  const result = calculatorUtils.calculatePaceResults(input, target, {});

  expect(result).to.deep.equal({
    distanceValue: 20,
    distanceUnit: 'meters',
    time: 2,
    result: 'time',
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
    result: 'distance',
  };

  const result1 = calculatorUtils.calculatePaceResults(input, target, 'metric');
  const result2 = calculatorUtils.calculatePaceResults(input, target, 'imperial');

  expect(result1.distanceValue).to.be.closeTo(1.609, 0.001);
  expect(result1.distanceUnit).to.equal('kilometers');
  expect(result2.distanceValue).to.be.closeTo(1.000, 0.001);
  expect(result2.distanceUnit).to.equal('miles');
});

test('should correctly predict race times', () => {
  const input = {
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  };
  const target = {
    distanceValue: 10,
    distanceUnit: 'kilometers',
    result: 'time',
  };
  const options = {
    model: 'average',
    riegelExponent: 1.06,
  }

  const result = calculatorUtils.calculateRaceResults(input, target, options, 'imperial');

  expect(result.time).to.be.closeTo(2495, 1);
  expect(result.distanceValue).to.equal(10);
  expect(result.distanceUnit).to.equal('kilometers');
  expect(result.result).to.equal('time');
});

test('should correctly calculate race distances according to default units setting', () => {
  const input = {
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  };
  const target = {
    time: 2495,
    result: 'distance',
  };
  const options = {
    model: 'average',
    riegelExponent: 1.06,
  }

  const result1 = calculatorUtils.calculateRaceResults(input, target, options, 'metric');
  const result2 = calculatorUtils.calculateRaceResults(input, target, options, 'imperial');

  expect(result1.distanceValue).to.be.closeTo(10, 0.01);
  expect(result1.distanceUnit).to.equal('kilometers');
  expect(result1.time).to.equal(2495);
  expect(result1.result).to.equal('distance');
  expect(result2.distanceValue).to.be.closeTo(6.214, 0.01);
  expect(result2.distanceUnit).to.equal('miles');
  expect(result2.time).to.equal(2495);
  expect(result2.result).to.equal('distance');
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
    result: 'time',
  };
  const options = {
    model: 'RiegelModel',
    riegelExponent: 1.12,
  }

  const result = calculatorUtils.calculateRaceResults(input, target, options, 'imperial');

  expect(result.time).to.be.closeTo(1031, 1);
  expect(result.distanceValue).to.equal(5);
  expect(result.distanceUnit).to.equal('kilometers');
  expect(result.result).to.equal('time');
});

test('should correctly calculate race statistics', () => {
  const input = {
    distanceValue: 5,
    distanceUnit: 'kilometers',
    time: 1200,
  };

  const results = calculatorUtils.calculateRaceStats(input);

  expect(results.purdyPoints).to.be.closeTo(454.5, 0.1);
  expect(results.vo2).to.be.closeTo(47.4, 0.1);
  expect(results.vo2MaxPercentage).to.be.closeTo(95.3, 0.1);
  expect(results.vo2Max).to.be.closeTo(49.8, 0.1);
});
