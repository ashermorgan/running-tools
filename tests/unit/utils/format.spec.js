import { expect } from 'chai';
import formatUtils from '@/utils/format';

describe('utils/format.js', () => {
  describe('formatNumber method', () => {
    it('should correctly format number when padding is not 0', () => {
      let result = formatUtils.formatNumber(12.3, 3, 0);
      expect(result).to.equal('012');

      result = formatUtils.formatNumber(12.3, 3, 2);
      expect(result).to.equal('012.30');

      result = formatUtils.formatNumber(123, 2, 0);
      expect(result).to.equal('123');

      result = formatUtils.formatNumber(-12, 3, 0);
      expect(result).to.equal('-012');
    });

    it('should correctly format number when extraDigits is true', () => {
      let result = formatUtils.formatNumber(1234, 0, 2);
      expect(result).to.equal('1234.00');

      result = formatUtils.formatNumber(1234.5, 0, 2);
      expect(result).to.equal('1234.50');

      result = formatUtils.formatNumber(1234.56, 0, 2);
      expect(result).to.equal('1234.56');

      result = formatUtils.formatNumber(1234.567, 0, 2);
      expect(result).to.equal('1234.57');

      result = formatUtils.formatNumber(1234.56, 0, 0);
      expect(result).to.equal('1235');
    });

    it('should correctly format number when extraDigits is false', () => {
      let result = formatUtils.formatNumber(1234, 0, 2, false);
      expect(result).to.equal('1234');

      result = formatUtils.formatNumber(1234.5, 0, 2, false);
      expect(result).to.equal('1234.5');

      result = formatUtils.formatNumber(1234.56, 0, 2, false);
      expect(result).to.equal('1234.56');

      result = formatUtils.formatNumber(1234.567, 0, 2, false);
      expect(result).to.equal('1234.57');

      result = formatUtils.formatNumber(1234.56, 0, 0, false);
      expect(result).to.equal('1235');
    });

    it('should correctly format undefined', () => {
      let result = formatUtils.formatNumber(undefined, 0, 2);
      expect(result).to.equal('NaN');

      result = formatUtils.formatNumber(undefined, 0, 2, false);
      expect(result).to.equal('NaN');

      result = formatUtils.formatNumber(undefined, 5, 2);
      expect(result).to.equal('NaN');
    });

    it('should correctly format NaN', () => {
      let result = formatUtils.formatNumber(NaN, 0, 0);
      expect(result).to.equal('NaN');

      result = formatUtils.formatNumber(NaN, 0, 2, false);
      expect(result).to.equal('NaN');

      result = formatUtils.formatNumber(NaN, 5, 2);
      expect(result).to.equal('NaN');
    });

    it('should correctly format +/- Infinity', () => {
      let result = formatUtils.formatNumber(Infinity);
      expect(result).to.equal('Infinity');

      result = formatUtils.formatNumber(Infinity, 10, 2);
      expect(result).to.equal('Infinity');

      result = formatUtils.formatNumber(-Infinity);
      expect(result).to.equal('-Infinity');
    });

    it('should correctly format numbers less than 1', () => {
      let result = formatUtils.formatNumber(0.123, 0, 0);
      expect(result).to.equal('0');

      result = formatUtils.formatNumber(0.123, 0, 2);
      expect(result).to.equal('0.12');
    });

    it('should correctly format negative numbers', () => {
      let result = formatUtils.formatNumber(-12, 0, 2, false);
      expect(result).to.equal('-12');

      result = formatUtils.formatNumber(-12, 0, 2);
      expect(result).to.equal('-12.00');

      result = formatUtils.formatNumber(-12.34, 0, 2);
      expect(result).to.equal('-12.34');

      result = formatUtils.formatNumber(-12.34, 3, 2);
      expect(result).to.equal('-012.34');

      result = formatUtils.formatNumber(-0.12, 0, 2);
      expect(result).to.equal('-0.12');
    });
  });

  describe('formatDuration method', () => {
    it('should correctly divide durations into parts', () => {
      const result = formatUtils.formatDuration(3600 + 120 + 3 + 0.4);
      expect(result).to.equal('01:02:03.40');
    });

    it('should correctly format duration when padding is 7', () => {
      const result = formatUtils.formatDuration(3600 + 120 + 3 + 0.4, 7);
      expect(result).to.equal('01:02:03.40');
    });

    it('should correctly format duration when padding is 3', () => {
      let result = formatUtils.formatDuration(3600 + 120 + 3 + 0.4, 3);
      expect(result).to.equal('1:02:03.40');

      result = formatUtils.formatDuration(120 + 3 + 0.4, 3);
      expect(result).to.equal('2:03.40');

      result = formatUtils.formatDuration(3 + 0.4, 3);
      expect(result).to.equal('0:03.40');
    });

    it('should correctly format duration when padding is 0', () => {
      const result = formatUtils.formatDuration(0.4, 0);
      expect(result).to.equal('0.40');
    });

    it('should correctly format duration when digits is 3', () => {
      const result = formatUtils.formatDuration(3600 + 120 + 3 + 0.4567, 0, 3);
      expect(result).to.equal('1:02:03.457');
    });

    it('should correctly format duration when digits is 0', () => {
      const result = formatUtils.formatDuration(3600 + 120 + 3 + 0.456, 0, 0);
      expect(result).to.equal('1:02:03');
    });

    it('should correctly format NaN', () => {
      const result = formatUtils.formatDuration(NaN);
      expect(result).to.equal('NaN');
    });

    it('should correctly format +/- Infinity', () => {
      let result = formatUtils.formatDuration(Infinity);
      expect(result).to.equal('Infinity');

      result = formatUtils.formatDuration(-Infinity);
      expect(result).to.equal('-Infinity');
    });

    it('should correctly format 0 when padding is 0', () => {
      const result = formatUtils.formatDuration(0, 0);
      expect(result).to.equal('0.00');
    });

    it('should correctly format negative durations', () => {
      const result = formatUtils.formatDuration(-3600 - 120 - 3 - 0.4);
      expect(result).to.equal('-01:02:03.40');
    });

    it('should correctly format 59.9999', () => {
      const result = formatUtils.formatDuration(59.9999);
      expect(result).to.equal('00:01:00.00');
    });

    it('should correctly format duration when extraDigits is false', () => {
      let result = formatUtils.formatDuration(83, 0, 2, false);
      expect(result).to.equal('1:23');

      result = formatUtils.formatDuration(83.4, 0, 2, false);
      expect(result).to.equal('1:23.4');

      result = formatUtils.formatDuration(83.45, 0, 2, false);
      expect(result).to.equal('1:23.45');

      result = formatUtils.formatDuration(83.456, 0, 2, false);
      expect(result).to.equal('1:23.46');

      result = formatUtils.formatDuration(83.45, 0, 0, false);
      expect(result).to.equal('1:23');
    });
  });
});
