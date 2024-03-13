import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IntegerInput from '@/components/IntegerInput.vue';

test('should be initialized to modelValue', () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 123 },
  });

  // Assert value is 1
  expect(wrapper.find('input').element.value).to.equal('123');
});

test('should fire input event when value changes', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput);

  // Set value to 1
  await wrapper.find('input').setValue('1');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[1]]);
});

test('should format value according to padding prop', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { padding: 2 },
  });

  // Assert value is correctly formatted
  expect(wrapper.find('input').element.value).to.equal('00');
});

test('should format input value on blur', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 1, padding: 2 },
  });

  // Set value to '2'
  await wrapper.find('input').setValue('2');

  // Assert value was not updated
  expect(wrapper.find('input').element.value).to.equal('2');

  // Trigger blur event
  await wrapper.find('input').trigger('blur');

  // Assert value was formatted
  expect(wrapper.find('input').element.value).to.equal('02');
});
