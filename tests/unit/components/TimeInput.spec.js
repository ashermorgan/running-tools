/* eslint-disable no-underscore-dangle */

import { expect } from 'chai';
import { shallowMount, mount } from '@vue/test-utils';
import TimeInput from '@/components/TimeInput.vue';

describe('components/TimeInput.vue', () => {
  it('value should be 0:00:0.00 by default', () => {
    // Initialize component
    const wrapper = shallowMount(TimeInput);

    // Assert value is 0:00:00.00
    expect(wrapper.vm.hours).to.equal(0);
    expect(wrapper.vm.minutes).to.equal(0);
    expect(wrapper.vm.seconds).to.equal(0.00);
  });

  it('should read value prop', () => {
    // Initialize component
    const wrapper = shallowMount(TimeInput, {
      propsData: { value: 3600 + 60 + 1.5 },
    });

    // Assert value is 1:01:01.50
    expect(wrapper.vm.hours).to.equal(1);
    expect(wrapper.vm.minutes).to.equal(1);
    expect(wrapper.vm.seconds).to.equal(1.50);
  });

  it('should update when value prop changes', async () => {
    // Initialize component
    const wrapper = shallowMount(TimeInput);

    // Set value prop to 60
    await wrapper.setProps({ value: 60 });

    // Assert value is 0:01:00.00
    expect(wrapper.vm.hours).to.equal(0);
    expect(wrapper.vm.minutes).to.equal(1);
    expect(wrapper.vm.seconds).to.equal(0.00);
  });

  it('should emit input event when value changes', async () => {
    // Initialize component
    const wrapper = shallowMount(TimeInput);

    // Change value to 1:00:00.00
    await wrapper.setData({ internalValue: 3600 });

    // Assert input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([[3600.00]]);

    // Change value to 1:00:01.50
    await wrapper.setData({ internalValue: 3601.5 });

    // Assert another input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([[3600.00], [3601.50]]);
  });

  it('up arrow should increment value', async () => {
    // Initialize component
    const wrapper = mount(TimeInput, {
      propsData: { value: 59 },
    });

    // Press up arrow in hours field
    await wrapper.find('input.hours').trigger('keydown', { key: 'ArrowUp' });

    // Assert value is 01:00:59.00 and input event was emitted
    expect(wrapper.vm.internalValue).to.equal(3659);
    expect(wrapper.emitted().input).to.deep.equal([[3659]]);

    // Press up arrow in seconds field
    await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

    // Assert value is 01:01:00.00 and input event was emitted
    expect(wrapper.vm.internalValue).to.equal(3660);
    expect(wrapper.emitted().input).to.deep.equal([[3659], [3660]]);
  });

  it('up arrow should not increment value past the maximum', async () => {
    // Initialize component
    const wrapper = mount(TimeInput, {
      propsData: { value: 359998 },
    });

    // Press up arrow in seconds field
    await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

    // Assert value is 99:59:59.00 and input event was emitted
    expect(wrapper.vm.internalValue).to.equal(359999);
    expect(wrapper.emitted().input).to.deep.equal([[359999]]);

    // Press up arrow in seconds field
    await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

    // Assert value is 99:59:59.99 and input event was emitted
    expect(wrapper.vm.internalValue).to.equal(359999.99);
    expect(wrapper.emitted().input).to.deep.equal([[359999], [359999.99]]);

    // Press up arrow in seconds field
    await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

    // Assert value is still 99:59:59.99 and input event was not emitted
    expect(wrapper.vm.internalValue).to.equal(359999.99);
    expect(wrapper.emitted().input).to.deep.equal([[359999], [359999.99]]);
  });

  it('down arrow should decrement value', async () => {
    // Initialize component
    const wrapper = mount(TimeInput, {
      propsData: { value: 3660 },
    });

    // Press down arrow in hours field
    await wrapper.find('input.hours').trigger('keydown', { key: 'ArrowDown' });

    // Assert value is 00:01:00.00 and input event was emitted
    expect(wrapper.vm.internalValue).to.equal(60);
    expect(wrapper.emitted().input).to.deep.equal([[60]]);

    // Press down arrow in seconds field
    await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowDown' });

    // Assert value is 00:00:59.00 and input event was emitted
    expect(wrapper.vm.internalValue).to.equal(59);
    expect(wrapper.emitted().input).to.deep.equal([[60], [59]]);
  });

  it('down arrow should not decrement value past the minimum', async () => {
    // Initialize component
    const wrapper = mount(TimeInput, {
      propsData: { value: 1 },
    });

    // Press down arrow in seconds field
    await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowDown' });

    // Assert value is 00:00:00.00 and input event was emitted
    expect(wrapper.vm.internalValue).to.equal(0);
    expect(wrapper.emitted().input).to.deep.equal([[0]]);

    // Press down arrow in seconds field
    await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowDown' });

    // Assert value is still 00:00:00.00 and input event was not emitted
    expect(wrapper.vm.internalValue).to.equal(0);
    expect(wrapper.emitted().input).to.deep.equal([[0]]);
  });
});
