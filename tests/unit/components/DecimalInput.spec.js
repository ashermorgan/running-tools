import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import DecimalInput from '@/components/DecimalInput.vue';

test('should be initialized to modelValue', () => {
  // Initialize component
  const wrapper = mount(DecimalInput, {
    propsData: { modelValue: 1.2 },
  });

  // Assert value is 1.2
  expect(wrapper.find('input').element.value).to.equal('1.2');
});

test('should fire input event when value changes', async () => {
  // Initialize component
  const wrapper = mount(DecimalInput);

  // Set value to 1.2
  await wrapper.find('input').setValue('1.2')

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[1.2]]);
});

test('should format value according to padding and digits props', async () => {
  // Initialize component
  const wrapper = mount(DecimalInput, {
    propsData: { padding: 2, digits: 3 },
  });

  // Assert value is correctly formatted
  expect(wrapper.find('input').element.value).to.equal('00.000');
});

test('should format input value on blur', async () => {
  // Initialize component
  const wrapper = mount(DecimalInput, {
    propsData: { modelValue: 1, padding: 2, digits: 2 },
  });

  // Set value to '1.2'
  await wrapper.find('input').setValue('1.2');

  // Assert value was not updated
  expect(wrapper.find('input').element.value).to.equal('1.2');

  // Trigger blur event
  await wrapper.find('input').trigger('blur');

  // Assert value was formatted
  expect(wrapper.find('input').element.value).to.equal('01.20');
});
