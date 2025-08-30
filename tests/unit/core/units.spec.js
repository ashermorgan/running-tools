import { describe, test, expect } from 'vitest';
import * as units from '@/core/units';

describe('convertTime method', () => {
  test('90 seconds should equal 1.5 minutes', () => {
    const result = units.convertTime(90, 'seconds', 'minutes');
    expect(result).to.equal(1.5);
  });

  test('1.5 minutes should equal 95 seconds', () => {
    const result = units.convertTime(1.5, 'minutes', 'seconds');
    expect(result).to.equal(90);
  });
});

describe('convertDistance method', () => {
  test('100 meters should equal 0.1 kilometers', () => {
    const result = units.convertDistance(100, 'meters', 'kilometers');
    expect(result).to.equal(0.1);
  });

  test('0.1 kilometers should equal 100 meters', () => {
    const result = units.convertDistance(0.1, 'kilometers', 'meters');
    expect(result).to.equal(100);
  });
});

describe('convertSpeed method', () => {
  test('1000 meters per seconds should equal 3600 kilometers per hour', () => {
    const result = units.convertSpeed(1000, 'meters_per_second', 'kilometers_per_hour');
    expect(result).to.equal(3600);
  });

  test('3600 kilometers per hour should equal 1000 meters per second', () => {
    const result = units.convertSpeed(3600, 'kilometers_per_hour', 'meters_per_second');
    expect(result).to.equal(1000);
  });
});

describe('convertPace method', () => {
  test('1 second per meter should equal 1000 seconds per kilometer', () => {
    const result = units.convertPace(1, 'seconds_per_meter', 'seconds_per_kilometer');
    expect(result).to.equal(1000);
  });

  test('1000 seconds per kilometer should equal 1 second per meter', () => {
    const result = units.convertPace(1000, 'seconds_per_kilometer', 'seconds_per_meter');
    expect(result).to.equal(1);
  });
});

describe('convertSpeedPace method', () => {
  test('3600 kilometers per hour should equal 1 second per kilometer', () => {
    const result = units.convertSpeedPace(3600, 'kilometers_per_hour', 'seconds_per_kilometer');
    expect(result).to.equal(1);
  });

  test('1 second per kilometer should equal 3600 kilometers per hour', () => {
    const result = units.convertSpeedPace(3600, 'seconds_per_kilometer', 'kilometers_per_hour');
    expect(result).to.equal(1);
  });
});

describe('formatNumber method', () => {
  test('should correctly format number when padding is not 0', () => {
    let result = units.formatNumber(12.3, 3, 0);
    expect(result).to.equal('012');

    result = units.formatNumber(12.3, 3, 2);
    expect(result).to.equal('012.30');

    result = units.formatNumber(123, 2, 0);
    expect(result).to.equal('123');

    result = units.formatNumber(-12, 3, 0);
    expect(result).to.equal('-012');
  });

  test('should correctly format number when extraDigits is true', () => {
    let result = units.formatNumber(1234, 0, 2);
    expect(result).to.equal('1234.00');

    result = units.formatNumber(1234.5, 0, 2);
    expect(result).to.equal('1234.50');

    result = units.formatNumber(1234.56, 0, 2);
    expect(result).to.equal('1234.56');

    result = units.formatNumber(1234.567, 0, 2);
    expect(result).to.equal('1234.57');

    result = units.formatNumber(1234.56, 0, 0);
    expect(result).to.equal('1235');
  });

  test('should correctly format number when extraDigits is false', () => {
    let result = units.formatNumber(1234, 0, 2, false);
    expect(result).to.equal('1234');

    result = units.formatNumber(1234.5, 0, 2, false);
    expect(result).to.equal('1234.5');

    result = units.formatNumber(1234.56, 0, 2, false);
    expect(result).to.equal('1234.56');

    result = units.formatNumber(1234.567, 0, 2, false);
    expect(result).to.equal('1234.57');

    result = units.formatNumber(1234.56, 0, 0, false);
    expect(result).to.equal('1235');
  });

  test('should correctly format undefined', () => {
    let result = units.formatNumber(undefined, 0, 2);
    expect(result).to.equal('NaN');

    result = units.formatNumber(undefined, 0, 2, false);
    expect(result).to.equal('NaN');

    result = units.formatNumber(undefined, 5, 2);
    expect(result).to.equal('NaN');
  });

  test('should correctly format NaN', () => {
    let result = units.formatNumber(NaN, 0, 0);
    expect(result).to.equal('NaN');

    result = units.formatNumber(NaN, 0, 2, false);
    expect(result).to.equal('NaN');

    result = units.formatNumber(NaN, 5, 2);
    expect(result).to.equal('NaN');
  });

  test('should correctly format +/- Infinity', () => {
    let result = units.formatNumber(Infinity);
    expect(result).to.equal('Infinity');

    result = units.formatNumber(Infinity, 10, 2);
    expect(result).to.equal('Infinity');

    result = units.formatNumber(-Infinity);
    expect(result).to.equal('-Infinity');
  });

  test('should correctly format numbers smaller than 1', () => {
    let result = units.formatNumber(0.123, 0, 0);
    expect(result).to.equal('0');

    result = units.formatNumber(0.123, 0, 2);
    expect(result).to.equal('0.12');
  });

  test('should correctly format negative numbers', () => {
    let result = units.formatNumber(-12, 0, 2, false);
    expect(result).to.equal('-12');

    result = units.formatNumber(-12, 0, 2);
    expect(result).to.equal('-12.00');

    result = units.formatNumber(-12.34, 0, 2);
    expect(result).to.equal('-12.34');

    result = units.formatNumber(-12.34, 3, 2);
    expect(result).to.equal('-012.34');

    result = units.formatNumber(-0.12, 0, 2);
    expect(result).to.equal('-0.12');
  });
});

describe('formatDistance method', () => {
  test('should correctly format distances with a variety of units', () => {
    let result = units.formatDistance({
      distanceValue: 1,
      distanceUnit: units.DistanceUnits.Yards,
    }, false);
    expect(result).to.equal('1 yd');

    result = units.formatDistance({
      distanceValue: 2,
      distanceUnit: units.DistanceUnits.Meters,
    }, false);
    expect(result).to.equal('2 m');

    result = units.formatDistance({
      distanceValue: 3,
      distanceUnit: units.DistanceUnits.Kilometers,
    }, false);
    expect(result).to.equal('3 km');

    result = units.formatDistance({
      distanceValue: 4,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('4 mi');

    result = units.formatDistance({
      distanceValue: 5,
      distanceUnit: units.DistanceUnits.Marathons,
    }, false);
    expect(result).to.equal('5 Mar');
  });

  test('should correctly format distance when extraDigits is true', () => {
    let result = units.formatDistance({
      distanceValue: 1234,
      distanceUnit: units.DistanceUnits.Miles,
    }, true);
    expect(result).to.equal('1234.00 mi');

    result = units.formatDistance({
      distanceValue: 1234.5,
      distanceUnit: units.DistanceUnits.Miles,
    }, true);
    expect(result).to.equal('1234.50 mi');

    result = units.formatDistance({
      distanceValue: 1234.56,
      distanceUnit: units.DistanceUnits.Miles,
    }, true);
    expect(result).to.equal('1234.56 mi');

    result = units.formatDistance({
      distanceValue: 1234.567,
      distanceUnit: units.DistanceUnits.Miles,
    }, true);
    expect(result).to.equal('1234.57 mi');
  });

  test('should correctly format distance when extraDigits is false', () => {
    let result = units.formatDistance({
      distanceValue: 1234,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('1234 mi');

    result = units.formatDistance({
      distanceValue: 1234.5,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('1234.5 mi');

    result = units.formatDistance({
      distanceValue: 1234.56,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('1234.56 mi');

    result = units.formatDistance({
      distanceValue: 1234.567,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('1234.57 mi');
  });

  test('should correctly format distances smaller than 1', () => {
    let result = units.formatDistance({
      distanceValue: 0,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('0 mi');

    result = units.formatDistance({
      distanceValue: 0,
      distanceUnit: units.DistanceUnits.Miles,
    }, true);
    expect(result).to.equal('0.00 mi');

    result = units.formatDistance({
      distanceValue: 0.1,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('0.1 mi');

    result = units.formatDistance({
      distanceValue: 0.1,
      distanceUnit: units.DistanceUnits.Miles,
    }, true);
    expect(result).to.equal('0.10 mi');

    result = units.formatDistance({
      distanceValue: 0.12,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('0.12 mi');
  });

  test('should correctly format negative distances', () => {
    let result = units.formatDistance({
      distanceValue: -1234,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('-1234 mi');

    result = units.formatDistance({
      distanceValue: -1234,
      distanceUnit: units.DistanceUnits.Miles,
    }, true);
    expect(result).to.equal('-1234.00 mi');

    result = units.formatDistance({
      distanceValue: -1234.56,
      distanceUnit: units.DistanceUnits.Miles,
    }, false);
    expect(result).to.equal('-1234.56 mi');
  });
});

describe('formatDuration method', () => {
  test('should correctly divide durations into parts', () => {
    const result = units.formatDuration(3600 + 120 + 3 + 0.4);
    expect(result).to.equal('01:02:03.40');
  });

  test('should correctly format duration when padding is 7', () => {
    const result = units.formatDuration(3600 + 120 + 3 + 0.4, 7);
    expect(result).to.equal('01:02:03.40');
  });

  test('should correctly format duration when padding is 3', () => {
    let result = units.formatDuration(3600 + 120 + 3 + 0.4, 3);
    expect(result).to.equal('1:02:03.40');

    result = units.formatDuration(120 + 3 + 0.4, 3);
    expect(result).to.equal('2:03.40');

    result = units.formatDuration(3 + 0.4, 3);
    expect(result).to.equal('0:03.40');
  });

  test('should correctly format duration when padding is 0', () => {
    const result = units.formatDuration(0.4, 0);
    expect(result).to.equal('0.40');
  });

  test('should correctly format duration when digits is 3', () => {
    const result = units.formatDuration(3600 + 120 + 3 + 0.4567, 0, 3);
    expect(result).to.equal('1:02:03.457');
  });

  test('should correctly format duration when digits is 0', () => {
    const result = units.formatDuration(3600 + 120 + 3 + 0.456, 0, 0);
    expect(result).to.equal('1:02:03');
  });

  test('should correctly format NaN', () => {
    const result = units.formatDuration(NaN);
    expect(result).to.equal('NaN');
  });

  test('should correctly format +/- Infinity', () => {
    let result = units.formatDuration(Infinity);
    expect(result).to.equal('Infinity');

    result = units.formatDuration(-Infinity);
    expect(result).to.equal('-Infinity');
  });

  test('should correctly format 0 when padding is 0', () => {
    const result = units.formatDuration(0, 0);
    expect(result).to.equal('0.00');
  });

  test('should correctly format negative durations', () => {
    const result = units.formatDuration(-3600 - 120 - 3 - 0.4);
    expect(result).to.equal('-01:02:03.40');
  });

  test('should correctly format 59.9999', () => {
    const result = units.formatDuration(59.9999);
    expect(result).to.equal('00:01:00.00');
  });

  test('should correctly format duration when extraDigits is false', () => {
    let result = units.formatDuration(83, 0, 2, false);
    expect(result).to.equal('1:23');

    result = units.formatDuration(83.4, 0, 2, false);
    expect(result).to.equal('1:23.4');

    result = units.formatDuration(83.45, 0, 2, false);
    expect(result).to.equal('1:23.45');

    result = units.formatDuration(83.456, 0, 2, false);
    expect(result).to.equal('1:23.46');

    result = units.formatDuration(83.45, 0, 0, false);
    expect(result).to.equal('1:23');
  });
});

describe('formatPace method', () => {
  test('should correctly format paces in a variety of units', () => {
    let result = units.formatPace({
      distanceValue: 1,
      distanceUnit: units.DistanceUnits.Meters,
      time: 600,
    }, units.PaceUnits.SecondsPerMeter);
    expect(result).to.equal('10:00 s/m');

    result = units.formatPace({
      distanceValue: 2,
      distanceUnit: units.DistanceUnits.Kilometers,
      time: 600,
    }, units.PaceUnits.TimePerKilometer);
    expect(result).to.equal('5:00 / km');

    result = units.formatPace({
      distanceValue: 3,
      distanceUnit: units.DistanceUnits.Miles,
      time: 600,
    }, units.PaceUnits.TimePerMile);
    expect(result).to.equal('3:20 / mi');
  });

  test('should correctly format paces that require distance conversion', () => {
    let result = units.formatPace({
      distanceValue: 100,
      distanceUnit: units.DistanceUnits.Meters,
      time: 600,
    }, units.PaceUnits.TimePerKilometer);
    expect(result).to.equal('1:40:00 / km');

    result = units.formatPace({
      distanceValue: 2,
      distanceUnit: units.DistanceUnits.Kilometers,
      time: 600,
    }, units.PaceUnits.TimePerMile);
    expect(result).to.equal('8:03 / mi');

    result = units.formatPace({
      distanceValue: 0.03,
      distanceUnit: units.DistanceUnits.Miles,
      time: 600,
    }, units.PaceUnits.SecondsPerMeter);
    expect(result).to.equal('0:12 s/m');
  });
});
