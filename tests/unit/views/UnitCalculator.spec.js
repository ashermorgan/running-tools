import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import UnitCalculator from '@/views/UnitCalculator.vue';

beforeEach(() => {
  localStorage.clear();
})

test('should correctly update controls when category changes', async () => {
  // Initialize component
  const wrapper = shallowMount(UnitCalculator);

  // Change category
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('time');

  // Assert controls are correct
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1);
  expect(wrapper.find('select[aria-label="Input units"]').element.value).to.equal('seconds');
  expect(wrapper.find('select[aria-label="Output units"]').element.value).to.equal('hh:mm:ss');

  // Change category
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('speed_and_pace');

  // Assert controls are correct
  expect(wrapper.findComponent({ name: 'time-input' }).vm.modelValue).to.equal(600);
  expect(wrapper.find('select[aria-label="Input units"]').element.value).to.equal('seconds_per_mile');
  expect(wrapper.find('select[aria-label="Output units"]').element.value).to.equal('miles_per_hour');

  // Change category
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('distance');

  // Assert controls are correct
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1);
  expect(wrapper.find('select[aria-label="Input units"]').element.value).to.equal('miles');
  expect(wrapper.find('select[aria-label="Output units"]').element.value).to.equal('kilometers');
});

test('outputValue should be correct', async () => {
  // Initialize component
  const wrapper = shallowMount(UnitCalculator);

  // Change category and update input
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('distance');
  await wrapper.find('select[aria-label="Input units"]').setValue('kilometers');
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(2);
  await wrapper.find('select[aria-label="Output units"]').setValue('meters');

  // Assert output is correct
  expect(wrapper.find('span[aria-label="Output value"]').element.textContent).to.equal('2000.000');

  // Change category and update input
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('time');
  await wrapper.find('select[aria-label="Input units"]').setValue('minutes');
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(3);
  await wrapper.find('select[aria-label="Output units"]').setValue('seconds');

  // Assert output is correct
  expect(wrapper.find('span[aria-label="Output value"]').element.textContent).to.equal('180.000');

  // Change category and update input
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('speed_and_pace');
  await wrapper.find('select[aria-label="Input units"]').setValue('miles_per_hour');
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(2);
  await wrapper.find('select[aria-label="Output units"]').setValue('seconds_per_mile');

  // Assert output is correct
  expect(wrapper.find('span[aria-label="Output value"]').element.textContent).to.equal('00:30:00.000');
});

test('should correctly convert to and from hh:mm:ss', async () => {
  // Initialize component
  const wrapper = shallowMount(UnitCalculator);

  // Change category and update input
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('time');
  await wrapper.find('select[aria-label="Input units"]').setValue('hh:mm:ss');
  await wrapper.findComponent({ name: 'time-input' }).setValue(60);
  await wrapper.find('select[aria-label="Output units"]').setValue('minutes');

  // Assert controls are correct
  expect(wrapper.find('span[aria-label="Output value"]').element.textContent).to.equal('1.000');

  // Update input
  await wrapper.find('select[aria-label="Input units"]').setValue('minutes');
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(1);
  await wrapper.find('select[aria-label="Output units"]').setValue('hh:mm:ss');

  // Assert controls are correct
  expect(wrapper.find('span[aria-label="Output value"]').element.textContent).to.equal('00:01:00.000');
});

test('should correctly load saved inputs', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.unit-calculator-inputs', JSON.stringify({
    distance: {
      inputValue: 5,
      inputUnit: 'kilometers',
      outputUnit: 'miles',
    },
    time: {
      inputValue: 90,
      inputUnit: 'hh:mm:ss',
      outputUnit: 'minutes',
    },
    speed_and_pace: {
      inputValue: 15,
      inputUnit: 'miles_per_hour',
      outputUnit: 'seconds_per_mile',
    },
  }));

  // Initialize component
  const wrapper = shallowMount(UnitCalculator);

  // Change category
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('time');

  // Assert inputs are correct
  expect(wrapper.findComponent({ name: 'time-input' }).vm.modelValue).to.equal(90);
  expect(wrapper.find('select[aria-label="Input units"]').element.value).to.equal('hh:mm:ss');
  expect(wrapper.find('select[aria-label="Output units"]').element.value).to.equal('minutes');

  // Change category
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('speed_and_pace');

  // Assert inputs are correct
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(15);
  expect(wrapper.find('select[aria-label="Input units"]').element.value).to.equal('miles_per_hour');
  expect(wrapper.find('select[aria-label="Output units"]').element.value).to.equal('seconds_per_mile');

  // Change category
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('distance');

  // Assert inputs are correct
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(5);
  expect(wrapper.find('select[aria-label="Input units"]').element.value).to.equal('kilometers');
  expect(wrapper.find('select[aria-label="Output units"]').element.value).to.equal('miles');
});

test('should correctly save inputs', async () => {
  // Initialize component
  const wrapper = shallowMount(UnitCalculator);

  // Change category and update input
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('distance');
  await wrapper.find('select[aria-label="Input units"]').setValue('kilometers');
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(5);
  await wrapper.find('select[aria-label="Output units"]').setValue('miles');

  // Change category and update input
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('time');
  await wrapper.find('select[aria-label="Input units"]').setValue('hh:mm:ss');
  await wrapper.findComponent({ name: 'time-input' }).setValue(90);
  await wrapper.find('select[aria-label="Output units"]').setValue('minutes');

  // Change category and update input
  await wrapper.find('select[aria-label="Selected unit category"]').setValue('speed_and_pace');
  await wrapper.find('select[aria-label="Input units"]').setValue('miles_per_hour');
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(15);
  await wrapper.find('select[aria-label="Output units"]').setValue('seconds_per_mile');

  // Initialize localStorage
  expect(localStorage.getItem('running-tools.unit-calculator-inputs')).to.equal(JSON.stringify({
    distance: {
      inputValue: 5,
      inputUnit: 'kilometers',
      outputUnit: 'miles',
    },
    time: {
      inputValue: 90,
      inputUnit: 'hh:mm:ss',
      outputUnit: 'minutes',
    },
    speed_and_pace: {
      inputValue: 15,
      inputUnit: 'miles_per_hour',
      outputUnit: 'seconds_per_mile',
    },
  }));
});
