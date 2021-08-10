import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import TimeInput from '@/components/TimeInput.vue';

describe('TimeInput.vue', () => {
  it('value should be 0:00:0.00 by default', () => {
    // Initialize component
    const wrapper = shallowMount(TimeInput);

    // Assert value is 0:00:00.00
    expect(wrapper.vm._data.hours).to.equal(0);
    expect(wrapper.vm._data.minutes).to.equal(0);
    expect(wrapper.vm._data.seconds).to.equal(0.00);
  });

  it('should read value prop', () => {
    // Initialize component
    const wrapper = shallowMount(TimeInput, {
      propsData: { value: 3600 + 60 + 1.5 }
    });

    // Assert value is 1:01:01.50
    expect(wrapper.vm._data.hours).to.equal(1);
    expect(wrapper.vm._data.minutes).to.equal(1);
    expect(wrapper.vm._data.seconds).to.equal(1.50);
  });

  it('should update when value prop changes', async () => {
    // Initialize component
    const wrapper = shallowMount(TimeInput);

    // Set value prop to 60
    await wrapper.setProps({ value: 60 });

    // Assert value is 0:01:00.00
    expect(wrapper.vm._data.hours).to.equal(0);
    expect(wrapper.vm._data.minutes).to.equal(1);
    expect(wrapper.vm._data.seconds).to.equal(0.00);
  });

  it('should emit input event when value changes', async () => {
    // Initialize component
    const wrapper = shallowMount(TimeInput);

    // Change value to 1:00:00.00
    await wrapper.setData({ hours: 1 });

    // Assert input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([[3600.00]]);

    // Change value to 1:00:01.50
    await wrapper.setData({ seconds: 1.5 });

    // Assert another input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([[3600.00], [3601.50]]);
  });
});
