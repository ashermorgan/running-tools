import { expect } from 'chai';
import units from '@/utils/units';

describe('utils/units.js', () => {
  describe('convertTime method', () => {
    it('90 seconds should equal 1.5 minutes', () => {
      const result = units.convertTime(
        90,
        units.TIME_UNITS.seconds,
        units.TIME_UNITS.minutes,
      );
      expect(result).to.equal(1.5);
    });

    it('1.5 minutes should equal 95 seconds', () => {
      const result = units.convertTime(
        1.5,
        units.TIME_UNITS.minutes,
        units.TIME_UNITS.seconds,
      );
      expect(result).to.equal(90);
    });
  });

  describe('convertDistance method', () => {
    it('100 meters should equal 0.1 kilometers', () => {
      const result = units.convertDistance(
        100,
        units.DISTANCE_UNITS.meters,
        units.DISTANCE_UNITS.kilometers,
      );
      expect(result).to.equal(0.1);
    });

    it('0.1 kilometers should equal 100 meters', () => {
      const result = units.convertDistance(
        0.1,
        units.DISTANCE_UNITS.kilometers,
        units.DISTANCE_UNITS.meters,
      );
      expect(result).to.equal(100);
    });
  });

  describe('convertSpeed method', () => {
    it('1000 meters per seconds should equal 3600 kilometers per hour', () => {
      const result = units.convertSpeed(
        1000,
        units.SPEED_UNITS.meters_per_second,
        units.SPEED_UNITS.kilometers_per_hour,
      );
      expect(result).to.equal(3600);
    });

    it('3600 kilometers per hour should equal 1000 meters per second', () => {
      const result = units.convertSpeed(
        3600,
        units.SPEED_UNITS.kilometers_per_hour,
        units.SPEED_UNITS.meters_per_second,
      );
      expect(result).to.equal(1000);
    });
  });

  describe('convertPace method', () => {
    it('1 second per meter should equal 1000 seconds per kilometer', () => {
      const result = units.convertPace(
        1,
        units.PACE_UNITS.seconds_per_meter,
        units.PACE_UNITS.seconds_per_kilometer,
      );
      expect(result).to.equal(1000);
    });

    it('1000 seconds per kilometer should equal 1 second per meter', () => {
      const result = units.convertPace(
        1000,
        units.PACE_UNITS.seconds_per_kilometer,
        units.PACE_UNITS.seconds_per_meter,
      );
      expect(result).to.equal(1);
    });
  });

  describe('convertSpeedPace method', () => {
    it('3600 kilometers per hour should equal 1 second per kilometer', () => {
      const result = units.convertSpeedPace(
        3600,
        units.SPEED_UNITS.kilometers_per_hour,
        units.PACE_UNITS.seconds_per_kilometer,
      );
      expect(result).to.equal(1);
    });

    it('1 second per kilometer should equal 3600 kilometers per hour', () => {
      const result = units.convertSpeedPace(
        3600,
        units.PACE_UNITS.seconds_per_kilometer,
        units.SPEED_UNITS.kilometers_per_hour,
      );
      expect(result).to.equal(1);
    });
  });

  describe('formatDuration method', () => {
    it('should correctly divide durations into parts', () => {
      const result = units.formatDuration(3600 + 120 + 3 + 0.4);
      expect(result).to.equal('01:02:03.40');
    });

    it('should correctly format duration when padding is 7', () => {
      const result = units.formatDuration(3600 + 120 + 3 + 0.4, 7);
      expect(result).to.equal('01:02:03.40');
    });

    it('should correctly format duration when padding is 3', () => {
      let result = units.formatDuration(3600 + 120 + 3 + 0.4, 3);
      expect(result).to.equal('1:02:03.40');

      result = units.formatDuration(120 + 3 + 0.4, 3);
      expect(result).to.equal('2:03.40');

      result = units.formatDuration(3 + 0.4, 3);
      expect(result).to.equal('0:03.40');
    });

    it('should correctly format duration when padding is 0', () => {
      const result = units.formatDuration(0.4, 0);
      expect(result).to.equal('0.40');
    });

    it('should correctly format duration when digits is 3', () => {
      const result = units.formatDuration(3600 + 120 + 3 + 0.4567, 0, 3);
      expect(result).to.equal('1:02:03.457');
    });

    it('should correctly format duration when digits is 0', () => {
      const result = units.formatDuration(3600 + 120 + 3 + 0.456, 0, 0);
      expect(result).to.equal('1:02:03');
    });

    it('should correctly format NaN', () => {
      const result = units.formatDuration(NaN);
      expect(result).to.equal('NaN');
    });

    it('should correctly format +/- Infinity', () => {
      let result = units.formatDuration(Infinity);
      expect(result).to.equal('Infinity');

      result = units.formatDuration(-Infinity);
      expect(result).to.equal('-Infinity');
    });

    it('should correctly format 0 when padding is 0', () => {
      const result = units.formatDuration(0, 0);
      expect(result).to.equal('0.00');
    });

    it('should correctly format negative durations', () => {
      const result = units.formatDuration(-3600 - 120 - 3 - 0.4);
      expect(result).to.equal('-01:02:03.40');
    });

    it('should correctly format 59.9999', () => {
      const result = units.formatDuration(59.9999);
      expect(result).to.equal('00:01:00.00');
    });
  });
});
