import { describe, test, expect } from 'vitest';
import * as targets from '@/utils/targets';

describe('sort method', () => {
  test('should correctly sort targets', () => {
    // Initialize unsorted and sorted targets
    const input = [
      { time: 60, type: 'time' },
      { distanceUnit: 'kilometers', distanceValue: 5, type: 'distance' },
      { distanceUnit: 'miles', distanceValue: 3, type: 'distance' },
    ];
    const expected = [
      { distanceUnit: 'miles', distanceValue: 3, type: 'distance' },
      { distanceUnit: 'kilometers', distanceValue: 5, type: 'distance' },
      { time: 60, type: 'time' },
    ];

    // Assert sort method sorts targets correctly
    expect(targets.sort(input)).to.deep.equal(expected);
  });
});

describe('workoutTargetToString method', () => {
  test('should correctly stringify time target', () => {
    // Initialize original and stringified target
    const input = {
      splitValue: 1600, splitUnit: 'meters',
      type: 'time', time: 3600,
    };
    const expected = '1600 m @ 1:00:00';

    // Assert sort method sorts targets correctly
    expect(targets.workoutTargetToString(input)).to.deep.equal(expected);
  });

  test('should correctly stringify distance target', () => {
    // Initialize original and stringified target
    const input = {
        splitValue: 800, splitUnit: 'meters',
        type: 'distance', distanceValue: 5, distanceUnit: 'kilometers',
    };
    const expected = '800 m @ 5 km';

    // Assert sort method sorts targets correctly
    expect(targets.workoutTargetToString(input)).to.deep.equal(expected);
  });

  test('should correctly stringify race target', () => {
    // Initialize original and stringified target
    const input = {
        splitValue: 5, splitUnit: 'kilometers',
        type: 'distance', distanceValue: 5, distanceUnit: 'kilometers',
    };
    const expected = '5 km';

    // Assert sort method sorts targets correctly
    expect(targets.workoutTargetToString(input)).to.deep.equal(expected);
  });
});
