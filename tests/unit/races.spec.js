import { expect } from 'chai';
import raceUtils from '@/utils/races';

describe('utils/races.js', () => {
  describe('RiegelFormula method', () => {
    it('Predictions should be approximately correct', () => {
      const result = raceUtils.RiegelFormula(400, 60, 800);
      expect(result).to.be.closeTo(125, 0.5);
    });
  });

  describe('CameronFormula method', () => {
    it('Predictions should be approximately correct', () => {
      const result = raceUtils.CameronFormula(800, 115, 1500);
      expect(result).to.be.closeTo(238.48, 0.5);
    });
  });

  describe('AverageFormula method', () => {
    it('Predictions should be correct', () => {
      const result = raceUtils.AverageFormula(5000, 20 * 60, 10000);
      const riegel = raceUtils.RiegelFormula(5000, 20 * 60, 10000);
      const cameron = raceUtils.CameronFormula(5000, 20 * 60, 10000);
      expect(result).to.equal((riegel + cameron) / 2);
    });
  });
});
