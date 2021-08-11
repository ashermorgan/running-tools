import { expect } from 'chai';
import pace from '@/utils/paces.js';



describe('utils/pace.js', () => {
  describe('getPace method', () => {
    it('2 meters in 6 seconds should equal 3 seconds per meter', () => {
      expect(pace.getPace(2, 6)).to.equal(3);
    });
  });

  describe('getTime method', () => {
    it('2 meters at 3 seconds per meter should equal 6 seconds', () => {
      expect(pace.getTime(3, 2)).to.equal(6);
    });
  });

  describe('getDistance method', () => {
    it('6 seconds at 3 seconds per meter should equal 2 meters', () => {
      expect(pace.getDistance(3, 6)).to.equal(2);
    });
  });
});
