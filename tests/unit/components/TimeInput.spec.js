import { test, expect } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import TimeInput from '@/components/TimeInput.vue';

test('should correctly render input label', () => {
  // Initialize component
  const wrapper = mount(TimeInput, {
    propsData: {
      modelValue: 0,
      label: 'My input',
    },
  });

  // Assert input fields are correct
  expect(wrapper.findAll('input')[0].element.ariaLabel).to.equal('My input hours');
  expect(wrapper.findAll('input')[1].element.ariaLabel).to.equal('My input minutes');
  expect(wrapper.findAll('input')[2].element.ariaLabel).to.equal('My input seconds');
});

test('value should be 0:00:0.00 by default', () => {
  // Initialize component
  const wrapper = shallowMount(TimeInput);

  // Assert value is 0:00:00.00
  expect(wrapper.vm.hours).to.equal(0);
  expect(wrapper.vm.minutes).to.equal(0);
  expect(wrapper.vm.seconds).to.equal(0.00);
});

test('should read value prop', () => {
  // Initialize component
  const wrapper = shallowMount(TimeInput, {
    propsData: { modelValue: 3600 + 60 + 1.5 },
  });

  // Assert value is 1:01:01.50
  expect(wrapper.vm.hours).to.equal(1);
  expect(wrapper.vm.minutes).to.equal(1);
  expect(wrapper.vm.seconds).to.equal(1.50);
});

test('should update when value prop changes', async () => {
  // Initialize component
  const wrapper = shallowMount(TimeInput);

  // Set value prop to 60
  await wrapper.setProps({ modelValue: 60 });

  // Assert value is 0:01:00.00
  expect(wrapper.vm.hours).to.equal(0);
  expect(wrapper.vm.minutes).to.equal(1);
  expect(wrapper.vm.seconds).to.equal(0.00);
});

test('should emit input event when value changes', async () => {
  // Initialize component
  const wrapper = shallowMount(TimeInput);

  // Change value to 1:00:00.00
  await wrapper.findAllComponents({ name: 'integer-input' })[0].setValue(1);

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[3600.00]]);

  // Change value to 1:00:01.50
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(1.5);

  // Assert another input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[3600.00], [3601.50]]);
});

test('up arrow should increment value', async () => {
  // Initialize component
  const wrapper = mount(TimeInput, {
    propsData: { modelValue: 59 },
  });

  // Press up arrow in hours field
  await wrapper.find('input.hours').trigger('keydown', { key: 'ArrowUp' });

  // Assert value is 01:00:59.00 and input event was emitted
  expect(wrapper.vm.internalValue).to.equal(3659);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[3659]]);

  // Press up arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

  // Assert value is 01:01:00.00 and input event was emitted
  expect(wrapper.vm.internalValue).to.equal(3660);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[3659], [3660]]);
});

test('up arrow should not increment value past the 2 field maximum', async () => {
  // Initialize component
  const wrapper = mount(TimeInput, {
    propsData: { modelValue: 3598, showHours: false },
  });

  // Press up arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

  // Assert value is 59:59.00 and input event was emitted
  expect(wrapper.vm.internalValue).to.equal(3599);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[3599]]);

  // Press up arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

  // Assert value is 59:59.99 and input event was gmitted
  expect(wrapper.vm.internalValue).to.equal(3599.99);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[3599], [3599.99]]);

  // Press up arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

  // Assert value is still 59:59.99 and input event was not emitted
  expect(wrapper.vm.internalValue).to.equal(3599.99);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[3599], [3599.99]]);
});

test('up arrow should not increment value past the 3 field maximum', async () => {
  // Initialize component
  const wrapper = mount(TimeInput, {
    propsData: { modelValue: 359998, showHours: true },
  });

  // Press up arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

  // Assert value is 99:59:59.00 and input event was emitted
  expect(wrapper.vm.internalValue).to.equal(359999);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[359999]]);

  // Press up arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

  // Assert value is 99:59:59.99 and input event was emitted
  expect(wrapper.vm.internalValue).to.equal(359999.99);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[359999], [359999.99]]);

  // Press up arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowUp' });

  // Assert value is still 99:59:59.99 and input event was not emitted
  expect(wrapper.vm.internalValue).to.equal(359999.99);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[359999], [359999.99]]);
});

test('down arrow should decrement value', async () => {
  // Initialize component
  const wrapper = mount(TimeInput, {
    propsData: { modelValue: 3660 },
  });

  // Press down arrow in hours field
  await wrapper.find('input.hours').trigger('keydown', { key: 'ArrowDown' });

  // Assert value is 00:01:00.00 and input event was emitted
  expect(wrapper.vm.internalValue).to.equal(60);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[60]]);

  // Press down arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowDown' });

  // Assert value is 00:00:59.00 and input event was emitted
  expect(wrapper.vm.internalValue).to.equal(59);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[60], [59]]);
});

test('down arrow should not decrement value past the minimum', async () => {
  // Initialize component
  const wrapper = mount(TimeInput, {
    propsData: { modelValue: 1 },
  });

  // Press down arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowDown' });

  // Assert value is 00:00:00.00 and input event was emitted
  expect(wrapper.vm.internalValue).to.equal(0);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[0]]);

  // Press down arrow in seconds field
  await wrapper.find('input.seconds').trigger('keydown', { key: 'ArrowDown' });

  // Assert value is still 00:00:00.00 and input event was not emitted
  expect(wrapper.vm.internalValue).to.equal(0);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[0]]);
});
