import { expect } from 'chai';
import units from '@/utils/units';

describe('utils/units.js', () => {
  describe('convertTime method', () => {
    it('90 seconds should equal 1.5 minutes', () => {
      const result = units.convertTime(90, 'seconds', 'minutes');
      expect(result).to.equal(1.5);
    });

    it('1.5 minutes should equal 95 seconds', () => {
      const result = units.convertTime(1.5, 'minutes', 'seconds');
      expect(result).to.equal(90);
    });
  });

  describe('convertDistance method', () => {
    it('100 meters should equal 0.1 kilometers', () => {
      const result = units.convertDistance(100, 'meters', 'kilometers');
      expect(result).to.equal(0.1);
    });

    it('0.1 kilometers should equal 100 meters', () => {
      const result = units.convertDistance(0.1, 'kilometers', 'meters');
      expect(result).to.equal(100);
    });
  });

  describe('convertSpeed method', () => {
    it('1000 meters per seconds should equal 3600 kilometers per hour', () => {
      const result = units.convertSpeed(1000, 'meters_per_second', 'kilometers_per_hour');
      expect(result).to.equal(3600);
    });

    it('3600 kilometers per hour should equal 1000 meters per second', () => {
      const result = units.convertSpeed(3600, 'kilometers_per_hour', 'meters_per_second');
      expect(result).to.equal(1000);
    });
  });

  describe('convertPace method', () => {
    it('1 second per meter should equal 1000 seconds per kilometer', () => {
      const result = units.convertPace(1, 'seconds_per_meter', 'seconds_per_kilometer');
      expect(result).to.equal(1000);
    });

    it('1000 seconds per kilometer should equal 1 second per meter', () => {
      const result = units.convertPace(1000, 'seconds_per_kilometer', 'seconds_per_meter');
      expect(result).to.equal(1);
    });
  });

  describe('convertSpeedPace method', () => {
    it('3600 kilometers per hour should equal 1 second per kilometer', () => {
      const result = units.convertSpeedPace(3600, 'kilometers_per_hour', 'seconds_per_kilometer');
      expect(result).to.equal(1);
    });

    it('1 second per kilometer should equal 3600 kilometers per hour', () => {
      const result = units.convertSpeedPace(3600, 'seconds_per_kilometer', 'kilometers_per_hour');
      expect(result).to.equal(1);
    });
  });
});
