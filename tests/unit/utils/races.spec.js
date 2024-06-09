import { describe, test, expect } from 'vitest';
import raceUtils from '@/utils/races';

describe('predictTime method', () => {
  describe('PredictTime method', () => {
    test('Average Model', () => {
      const riegel = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      const cameron = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      const purdyPoints = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      const vo2Max = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      const expected = (riegel + cameron + purdyPoints + vo2Max) / 4;

      const result = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      expect(result).to.equal(expected);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictTime(5000, 1200, 5000, 'AverageModel');
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('Purdy Points Model', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.predictTime(5000, 1200, 10000, 'PurdyPointsModel');
      expect(result).to.be.closeTo(2490, 1);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictTime(5000, 1200, 5000, 'PurdyPointsModel');
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('VO2 Max Model', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.predictTime(5000, 1200, 10000, 'VO2MaxModel');
      expect(result).to.be.closeTo(2488, 1);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictTime(5000, 1200, 5000, 'VO2MaxModel');
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('Cameron Model', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.predictTime(5000, 1200, 10000, 'CameronModel');
      expect(result).to.be.closeTo(2500, 1);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictTime(5000, 1200, 5000, 'CameronModel');
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('Riegel Model', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.predictTime(5000, 1200, 10000, 'RiegelModel');
      expect(result).to.be.closeTo(2502, 1);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictTime(5000, 1200, 5000, 'RiegelModel');
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });
});

describe('predictDistance method', () => {
  describe('Average Model', () => {
    test('Predictions should be correct', () => {
      const riegel = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      const cameron = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      const purdyPoints = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      const vo2Max = raceUtils.predictTime(5000, 1200, 10000, 'AverageModel');
      const expected = (riegel + cameron + purdyPoints + vo2Max) / 4;

      const result = raceUtils.predictDistance(1200, 5000, expected);
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictDistance(1200, 5000, 1200, 'AverageModel');
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });

  describe('Purdy Points Model', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.predictDistance(1200, 5000, 2490, 'PurdyPointsModel');
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictDistance(1200, 5000, 1200, 'PurdyPointsModel');
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });

  describe('VO2 Max Model', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.predictDistance(1200, 5000, 2488, 'VO2MaxModel');
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictDistance(1200, 5000, 1200, 'VO2MaxModel');
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });

  describe('Cameron Model', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.predictDistance(1200, 5000, 2500, 'CameronModel');
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictDistance(1200, 5000, 1200, 'CameronModel');
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });

  describe('Riegel Model', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.predictDistance(1200, 5000, 2502, 'RiegelModel');
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.predictDistance(1200, 5000, 1200, 'RiegelModel');
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });
});

describe('getVO2 method', () => {
  test('Result should be approximately correct', () => {
    const result = raceUtils.getVO2(5000, 1200);
    expect(result).to.be.closeTo(47.4, 0.1);
  });
});

describe('getVO2Percentage method', () => {
  test('Result should be approximately correct', () => {
    const result = raceUtils.getVO2Percentage(660);
    expect(result).to.be.closeTo(1, 0.001);
  });
});

describe('getVO2Max method', () => {
  test('Result should be approximately correct', () => {
    const result = raceUtils.getVO2Max(5000, 1200);
    expect(result).to.be.closeTo(49.8, 0.1);
  });
});

describe('getPurdyPoints method', () => {
  test('Result should be approximately correct', () => {
    const result = raceUtils.getPurdyPoints(5000, 1200);
    expect(result).to.be.closeTo(454, 1);
  });
});
