import { describe, test, expect } from 'vitest';
import units from '@/utils/units';

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
