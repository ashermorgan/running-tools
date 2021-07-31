import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import units from '@/utils/units.js';



describe('utils/units.js', () => {
  describe('convertTime method', () => {
    it('90 seconds should equal 1.5 minutes', () => {
      let result = units.convertTime(
        90,
        units.TIME_UNITS.second,
        units.TIME_UNITS.minute
      );
      expect(result).to.equal(1.5);
    });

    it('1.5 minutes should equal 95 seconds', () => {
      let result = units.convertTime(
        1.5,
        units.TIME_UNITS.minute,
        units.TIME_UNITS.second
      );
      expect(result).to.equal(90);
    });
  });


  describe('convertDistance method', () => {
    it('100 meters should equal 0.1 kilometers', () => {
      let result = units.convertDistance(
        100,
        units.DISTANCE_UNITS.meter,
        units.DISTANCE_UNITS.kilometer
      );
      expect(result).to.equal(0.1);
    });

    it('0.1 kilometers should equal 100 meters', () => {
      let result = units.convertDistance(
        0.1,
        units.DISTANCE_UNITS.kilometer,
        units.DISTANCE_UNITS.meter
      );
      expect(result).to.equal(100);
    });
  });


  describe('convertSpeed method', () => {
    it('1000 meters per seconds should equal 3600 kilometers per hour', () => {
      let result = units.convertSpeed(
        1000,
        units.SPEED_UNITS.meters_per_second,
        units.SPEED_UNITS.kilometers_per_hour
      );
      expect(result).to.equal(3600);
    });

    it('3600 kilometers per hour should equal 1000 meters per second', () => {
      let result = units.convertSpeed(
        3600,
        units.SPEED_UNITS.kilometers_per_hour,
        units.SPEED_UNITS.meters_per_second
      );
      expect(result).to.equal(1000);
    });
  });


  describe('convertPace method', () => {
    it('60 seconds per meter should equal 1000 minutes per kilometer', () => {
      let result = units.convertPace(
        60,
        units.PACE_UNITS.seconds_per_meter,
        units.PACE_UNITS.minutes_per_kilometer
      );
      expect(result).to.equal(1000);
    });

    it('1000 minutes per kilometer should equal 60 seconds per meter', () => {
      let result = units.convertPace(
        1000,
        units.PACE_UNITS.minutes_per_kilometer,
        units.PACE_UNITS.seconds_per_meter
      );
      expect(result).to.equal(60);
    });
  });


  describe('convertSpeedPace method', () => {
    it('60 kilometers per hour should equal 1 minute per kilometer', () => {
      let result = units.convertSpeedPace(
        60,
        units.SPEED_UNITS.kilometers_per_hour,
        units.PACE_UNITS.minutes_per_kilometer
      );
      expect(result).to.equal(1);
    });

    it('1 minute per kilometer should equal 60 kilometers per hour', () => {
      let result = units.convertSpeedPace(
        1,
        units.PACE_UNITS.minutes_per_kilometer,
        units.SPEED_UNITS.kilometers_per_hour
      );
      expect(result).to.equal(60);
    });
  });
});
