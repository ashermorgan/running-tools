import { describe, test, expect } from 'vitest';
import targets from '@/utils/targets';

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
