import { describe, test, expect } from 'vitest';
import paces from '@/utils/paces';

describe('getPace method', () => {
  test('2 meters in 6 seconds should equal 3 seconds per meter', () => {
    expect(paces.getPace(2, 6)).to.equal(3);
  });
});

describe('getTime method', () => {
  test('2 meters at 3 seconds per meter should equal 6 seconds', () => {
    expect(paces.getTime(3, 2)).to.equal(6);
  });
});

describe('getDistance method', () => {
  test('6 seconds at 3 seconds per meter should equal 2 meters', () => {
    expect(paces.getDistance(3, 6)).to.equal(2);
  });
});
