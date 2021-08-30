import { expect } from 'chai';
import raceUtils from '@/utils/races';

describe('utils/races.js', () => {
  describe('PurdyPointsModel method', () => {
    it('Predictions should be approximately correct', () => {
      const result = raceUtils.PurdyPointsModel(5000, 1200, 10000);
      expect(result).to.be.closeTo(2490, 1);
    });

    it('Should predict identical times for itentical distances', () => {
      const result = raceUtils.PurdyPointsModel(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('VO2MaxModel method', () => {
    it('Predictions should be approximately correct', () => {
      const result = raceUtils.VO2MaxModel(5000, 1200, 10000);
      expect(result).to.be.closeTo(2488, 1);
    });

    it('Should predict identical times for itentical distances', () => {
      const result = raceUtils.VO2MaxModel(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('CameronModel method', () => {
    it('Predictions should be approximately correct', () => {
      const result = raceUtils.CameronModel(5000, 1200, 10000);
      expect(result).to.be.closeTo(2500, 1);
    });

    it('Should predict identical times for itentical distances', () => {
      const result = raceUtils.CameronModel(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('RiegelModel method', () => {
    it('Predictions should be approximately correct', () => {
      const result = raceUtils.RiegelModel(5000, 1200, 10000);
      expect(result).to.be.closeTo(2502, 1);
    });

    it('Should predict identical times for itentical distances', () => {
      const result = raceUtils.RiegelModel(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });

  describe('AverageModel method', () => {
    it('Predictions should be correct', () => {
      const result = raceUtils.AverageModel(5000, 1200, 10000);
      const riegel = raceUtils.RiegelModel(5000, 1200, 10000);
      const cameron = raceUtils.CameronModel(5000, 1200, 10000);
      const purdyPoints = raceUtils.PurdyPointsModel(5000, 1200, 10000);
      const vo2Max = raceUtils.VO2MaxModel(5000, 1200, 10000);
      expect(result).to.equal((riegel + cameron + purdyPoints + vo2Max) / 4);
    });

    it('Should predict identical times for itentical distances', () => {
      const result = raceUtils.AverageModel(5000, 1200, 5000);
      expect(result).to.be.closeTo(1200, 0.001);
    });
  });
});
