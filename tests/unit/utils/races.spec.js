import { describe, test, expect } from 'vitest';
import raceUtils from '@/utils/races';

describe('PurdyPointsModel', () => {
  describe('getPurdyPoints method', () => {
    test('Result should be approximately correct', () => {
      const result = raceUtils.PurdyPointsModel.getPurdyPoints(5000, 1200);
      expect(result).to.be.closeTo(454, 1);
    });
  });

  describe('PredictTime method', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.PurdyPointsModel.predictTime(5000, 1200, 10000);
      expect(result).to.be.closeTo(2490, 1);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.PurdyPointsModel.predictTime(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('PredictDistance method', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.PurdyPointsModel.predictDistance(1200, 5000, 2490);
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.PurdyPointsModel.predictDistance(1200, 5000, 1200);
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });
});

describe('VO2MaxModel', () => {
  describe('getVO2 method', () => {
    test('Result should be approximately correct', () => {
      const result = raceUtils.VO2MaxModel.getVO2(5000, 1200);
      expect(result).to.be.closeTo(47.4, 0.1);
    });
  });

  describe('getVO2Percentage method', () => {
    test('Result should be approximately correct', () => {
      const result = raceUtils.VO2MaxModel.getVO2Percentage(660);
      expect(result).to.be.closeTo(1, 0.001);
    });
  });

  describe('getVO2Max method', () => {
    test('Result should be approximately correct', () => {
      const result = raceUtils.VO2MaxModel.getVO2Max(5000, 1200);
      expect(result).to.be.closeTo(49.8, 0.1);
    });
  });

  describe('PredictTime method', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.VO2MaxModel.predictTime(5000, 1200, 10000);
      expect(result).to.be.closeTo(2488, 1);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.VO2MaxModel.predictTime(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('PredictDistance method', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.VO2MaxModel.predictDistance(1200, 5000, 2488);
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.VO2MaxModel.predictDistance(1200, 5000, 1200);
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });
});

describe('CameronModel', () => {
  describe('PredictTime method', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.CameronModel.predictTime(5000, 1200, 10000);
      expect(result).to.be.closeTo(2500, 1);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.CameronModel.predictTime(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('PredictDistance method', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.CameronModel.predictDistance(1200, 5000, 2500);
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.CameronModel.predictDistance(1200, 5000, 1200);
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });
});

describe('RiegelModel', () => {
  describe('PredictTime method', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.RiegelModel.predictTime(5000, 1200, 10000);
      expect(result).to.be.closeTo(2502, 1);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.RiegelModel.predictTime(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('PredictDistance method', () => {
    test('Predictions should be approximately correct', () => {
      const result = raceUtils.RiegelModel.predictDistance(1200, 5000, 2502);
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.RiegelModel.predictDistance(1200, 5000, 1200);
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });
});

describe('AverageModel', () => {
  describe('PredictTime method', () => {
    test('Predictions should be correct', () => {
      const riegel = raceUtils.RiegelModel.predictTime(5000, 1200, 10000);
      const cameron = raceUtils.CameronModel.predictTime(5000, 1200, 10000);
      const purdyPoints = raceUtils.PurdyPointsModel.predictTime(5000, 1200, 10000);
      const vo2Max = raceUtils.VO2MaxModel.predictTime(5000, 1200, 10000);
      const expected = (riegel + cameron + purdyPoints + vo2Max) / 4;

      const result = raceUtils.AverageModel.predictTime(5000, 1200, 10000);
      expect(result).to.equal(expected);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.AverageModel.predictTime(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('PredictDistance method', () => {
    test('Predictions should be correct', () => {
      const riegel = raceUtils.RiegelModel.predictTime(5000, 1200, 10000);
      const cameron = raceUtils.CameronModel.predictTime(5000, 1200, 10000);
      const purdyPoints = raceUtils.PurdyPointsModel.predictTime(5000, 1200, 10000);
      const vo2Max = raceUtils.VO2MaxModel.predictTime(5000, 1200, 10000);
      const expected = (riegel + cameron + purdyPoints + vo2Max) / 4;

      const result = raceUtils.AverageModel.predictDistance(1200, 5000, expected);
      expect(result).to.be.closeTo(10000, 10);
    });

    test('Should predict identical times for itentical distances', () => {
      const result = raceUtils.AverageModel.predictDistance(1200, 5000, 1200);
      expect(result).to.be.closeTo(5000, 0.001);
    });
  });
});
