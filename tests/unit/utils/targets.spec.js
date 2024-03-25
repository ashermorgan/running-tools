import { describe, test, expect } from 'vitest';
import targets from '@/utils/targets';

describe('sort method', () => {
  test('should correctly sort targets', () => {
    // Initialize unsorted and sorted targets
    const input = [
      { time: 60, result: 'distance' },
      { distanceUnit: 'kilometers', distanceValue: 5, result: 'time' },
      { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
    ];
    const expected = [
      { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
      { distanceUnit: 'kilometers', distanceValue: 5, result: 'time' },
      { time: 60, result: 'distance' },
    ];

    // Assert sort method sorts targets correctly
    expect(targets.sort(input)).to.deep.equal(expected);
  });
});
