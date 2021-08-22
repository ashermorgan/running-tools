/* eslint-disable no-underscore-dangle */

import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import raceUtils from '@/utils/races';
import RaceCalculator from '@/views/RaceCalculator.vue';

describe('RaceCalculator.vue', () => {
  it('should correctly predict race times', async () => {
    // Initialize component
    const wrapper = shallowMount(RaceCalculator);

    // Override input values
    await wrapper.setData({
      inputDistance: 5,
      inputUnit: 'kilometers',
      inputTime: 20 * 60,
    });

    // Predict race times
    const result = wrapper.vm.predictTime({
      distanceValue: 10,
      distanceUnit: 'kilometers',
    });

    // Assert result is correct
    const riegel = raceUtils.RiegelFormula(5000, 20 * 60, 10000);
    const cameron = raceUtils.CameronFormula(5000, 20 * 60, 10000);
    expect(result).to.deep.equal({
      distanceValue: 10,
      distanceUnit: 'kilometers',
      time: (riegel + cameron) / 2,
    });
  });
});
