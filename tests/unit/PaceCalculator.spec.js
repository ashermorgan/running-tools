import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import PaceCalculator from '@/views/PaceCalculator.vue';

describe('PaceCalculator.vue', () => {
  it('results should be correct', async () => {
    // Initialize component
    const wrapper = shallowMount(PaceCalculator);

    // Override input values
    wrapper.setData({
      inputDistance: 1,
      inputUnit: 'kilometers',
      inputTime: 100,
    });

    // Override targets
    await wrapper.setData({ targets: [
      { distanceValue: 10,  distanceUnit: 'meters' },
      { distanceValue: 20,  distanceUnit: 'meters' },
      { distanceValue: 100, distanceUnit: 'meters' },
      { distanceValue: 1,   distanceUnit: 'kilometers' },
    ]});

    // Assert results are correct
    expect(wrapper.vm._computedWatchers.results.value).to.deep.equal([
      { distanceValue: 10,  distanceUnit: 'meters',     time: 1 },
      { distanceValue: 20,  distanceUnit: 'meters',     time: 2 },
      { distanceValue: 100, distanceUnit: 'meters',     time: 10 },
      { distanceValue: 1,   distanceUnit: 'kilometers', time: 100 },
    ]);
  });

  it('results should be sorted by time', async () => {
    // Initialize component
    const wrapper = shallowMount(PaceCalculator);

    // Override input values
    wrapper.setData({
      inputDistance: 1,
      inputUnit: 'kilometers',
      inputTime: 100,
    });

    // Override targets
    await wrapper.setData({ targets: [
      { distanceValue: 20,  distanceUnit: 'meters' },
      { distanceValue: 100, distanceUnit: 'meters' },
      { distanceValue: 1,   distanceUnit: 'kilometers' },
      { distanceValue: 10,  distanceUnit: 'meters' },
    ]});

    // Assert results are correct
    expect(wrapper.vm._computedWatchers.results.value).to.deep.equal([
      { distanceValue: 10,  distanceUnit: 'meters',     time: 1 },
      { distanceValue: 20,  distanceUnit: 'meters',     time: 2 },
      { distanceValue: 100, distanceUnit: 'meters',     time: 10 },
      { distanceValue: 1,   distanceUnit: 'kilometers', time: 100 },
    ]);
  });
});
