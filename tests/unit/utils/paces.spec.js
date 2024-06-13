import { describe, test, expect } from 'vitest';
import * as paces from '@/utils/paces';

describe('calculateTime method', () => {
  test('1 meters in 3 seconds should equal 2 meters in 6 seconds', () => {
    expect(paces.calculateTime(1, 3, 2)).to.equal(6);
  });
});

describe('calculateDistance method', () => {
  test('1 meter in 3 seconds should equal 2 meters in 6 seconds', () => {
    expect(paces.calculateDistance(3, 1, 6)).to.equal(2);
  });
});
