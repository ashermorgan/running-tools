import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import UnitCalculator from '@/views/UnitCalculator.vue';

describe('UnitCalculator.vue', () => {
  it('should correctly update controls when category changes', async () => {
    // Initialize component
    const wrapper = shallowMount(UnitCalculator);

    // Change category
    await wrapper.setData({ category: 'time' });

    // Assert controls are correct
    expect(wrapper.vm._data.inputValue).to.equal(1);
    expect(wrapper.vm._data.inputUnit).to.equal('seconds');
    expect(wrapper.vm._data.outputUnit).to.equal('hh:mm:ss');

    // Change category
    await wrapper.setData({ category: 'speed_and_pace' });

    // Assert controls are correct
    expect(wrapper.vm._data.inputValue).to.equal(1);
    expect(wrapper.vm._data.inputUnit).to.equal('miles_per_hour');
    expect(wrapper.vm._data.outputUnit).to.equal('seconds_per_mile');

    // Change category
    await wrapper.setData({ category: 'distance' });

    // Assert controls are correct
    expect(wrapper.vm._data.inputValue).to.equal(1);
    expect(wrapper.vm._data.inputUnit).to.equal('miles');
    expect(wrapper.vm._data.outputUnit).to.equal('meters');
  });

  it('outputValue should be correct', async () => {
    // Initialize component
    const wrapper = shallowMount(UnitCalculator);

    // Change category and update input
    await wrapper.setData({ category: 'distance' });
    await wrapper.setData({
      inputValue: 2,
      inputUnit: 'kilometers',
      outputUnit: 'meters'
    });

    // Assert controls are correct
    expect(wrapper.vm._computedWatchers.outputValue.value).to.equal(2000);

    // Change category and update input
    await wrapper.setData({ category: 'time' });
    await wrapper.setData({
      inputValue: 3,
      inputUnit: 'minutes',
      outputUnit: 'seconds',
    });

    // Assert controls are correct
    expect(wrapper.vm._computedWatchers.outputValue.value).to.equal(3 * 60);

    // Change category and update input
    await wrapper.setData({ category: 'speed_and_pace' });
    await wrapper.setData({
      inputValue: 2,
      inputUnit: 'miles_per_hour',
      outputUnit: 'seconds_per_mile',
    });

    // Assert controls are correct
    expect(wrapper.vm._computedWatchers.outputValue.value).to.be.closeTo(30 * 60, 0.001);
  });

  it('should correctly convert to and from hh:mm:ss', async () => {
    // Initialize component
    const wrapper = shallowMount(UnitCalculator);

    // Change category and update input
    await wrapper.setData({ category: 'time' });
    await wrapper.setData({
      inputValue: 60,
      inputUnit: 'hh:mm:ss',
      outputUnit: 'minutes',
    });

    // Assert controls are correct
    expect(wrapper.vm._computedWatchers.outputValue.value).to.equal(1);

    // Update input
    await wrapper.setData({
      inputValue: 1,
      inputUnit: 'minutes',
      outputUnit: 'hh:mm:ss',
    });

    // Assert controls are correct
    expect(wrapper.vm._computedWatchers.outputValue.value).to.equal(60);
  });
});
