import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import IntegerInput from '@/components/IntegerInput.vue';

test('value should be 0 by default', () => {
  // Initialize component
  const wrapper = mount(IntegerInput);

  // Assert value is 0
  expect(wrapper.find('input').element.value).to.equal('0');
});

test('should read value prop', () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 1 },
  });

  // Assert value is 1
  expect(wrapper.find('input').element.value).to.equal('1');
});

test('up arrow should increment value by step', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { step: 2 },
  });

  // Press up arrow
  await wrapper.trigger('keydown', { key: 'ArrowUp' });

  // Assert value is 1 and input event was emitted
  expect(wrapper.find('input').element.value).to.equal('2');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[2]]);
});

test('down arrow should increment value by step', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { step: 2 },
  });

  // Press down arrow
  await wrapper.trigger('keydown', { key: 'ArrowDown' });

  // Assert value is -1 and input event was emitted
  expect(wrapper.find('input').element.value).to.equal('-2');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[-2]]);
});

test('should fire input event when value changes', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput);

  // Set value to 1
  wrapper.find('input').element.value = '1';
  await wrapper.find('input').trigger('input');

  // Assert input event was emitted
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[1]]);
});

test('should accept numerical values', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput);

  // Try to set value to 1
  wrapper.find('input').element.value = '1';
  await wrapper.find('input').trigger('input');

  // Assert value was accepted and input event was emitted
  expect(wrapper.find('input').element.value).to.equal('1');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[1]]);
});

test('should not accept decimal values', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 1 },
  });

  // Try to set value to 1.5
  wrapper.find('input').element.value = '1.5';
  await wrapper.find('input').trigger('input');

  // Assert value was not accepted and no events were emitted
  expect(wrapper.find('input').element.value).to.equal('1');
  expect(wrapper.emitted()['update:modelValue']).to.equal(undefined);
});

test('should not accept non numerical values', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 1 },
  });

  // Try to set value to a
  wrapper.find('input').element.value = 'a';
  await wrapper.find('input').trigger('input');

  // Assert value was not accepted and no events were emitted
  expect(wrapper.find('input').element.value).to.equal('1');
  expect(wrapper.emitted()['update:modelValue']).to.equal(undefined);
});

test('should format input value on blur', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 1, padding: 3 },
  });

  // Set value to '01'
  wrapper.find('input').element.value = '01';
  await wrapper.find('input').trigger('input');

  // Assert value was not updated and no events were emitted
  expect(wrapper.find('input').element.value).to.equal('01');
  expect(wrapper.emitted()['update:modelValue']).to.equal(undefined);

  // Trigger blur event
  await wrapper.find('input').trigger('blur');

  // Assert value was formatted but no events were emitted
  expect(wrapper.find('input').element.value).to.equal('001');
  expect(wrapper.emitted()['update:modelValue']).to.equal(undefined);
});

test('should allow input to be empty until blur', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 5 },
  });

  // Set value to ''
  wrapper.find('input').element.value = '';
  await wrapper.find('input').trigger('input');

  // Assert value is '' and input event was emitted with default value
  expect(wrapper.find('input').element.value).to.equal('');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[0]]);

  // Trigger blur event
  await wrapper.find('input').trigger('blur');

  // Assert value is the default value but no new events were emitted
  expect(wrapper.find('input').element.value).to.equal('0');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[0]]);
});

test('should allow input to be "-" until blur', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 5 },
  });

  // Set value to '-'
  wrapper.find('input').element.value = '-';
  await wrapper.find('input').trigger('input');

  // Assert value is '-' and input event was emitted with default value
  expect(wrapper.find('input').element.value).to.equal('-');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[0]]);

  // Trigger blur event
  await wrapper.find('input').trigger('blur');

  // Assert value is the default value but no new events were emitted
  expect(wrapper.find('input').element.value).to.equal('0');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[0]]);
});

test('default value should be the minimum if 0 is not valid', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { modelValue: 3, max: 4, min: 2 },
  });

  // Set value to '' and trigger blur event so value must be updated
  wrapper.find('input').element.value = '';
  await wrapper.find('input').trigger('input');
  await wrapper.find('input').trigger('blur');

  // Assert value is 2 and input event was emitted
  expect(wrapper.find('input').element.value).to.equal('2');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[2]]);
});

test('should not allow input to be below the minimum', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { min: 10, modelValue: 20 },
  });

  // Try to set value to 9, which is below the minimum
  wrapper.find('input').element.value = '9';
  await wrapper.find('input').trigger('input');

  // Assert value is 10 and input event was emitted
  expect(wrapper.find('input').element.value).to.equal('10');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[10]]);

  // Try to decrement value
  await wrapper.trigger('keydown', { key: 'ArrowDown' });

  // Assert value is still 10 and no new event were emitted
  expect(wrapper.find('input').element.value).to.equal('10');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[10]]);
});

test('should not allow input to be above the maximum', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { max: 10 },
  });

  // Try to set value to 11, which is above the maximum
  wrapper.find('input').element.value = '11';
  await wrapper.find('input').trigger('input');

  // Assert value is 10 and input event was emitted
  expect(wrapper.find('input').element.value).to.equal('10');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[10]]);

  // Try to increment value
  await wrapper.trigger('keydown', { key: 'ArrowUp' });

  // Assert value is still 10 and no new events were emitted
  expect(wrapper.find('input').element.value).to.equal('10');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([[10]]);
});

test('should format value according to padding prop', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { padding: 2 },
  });

  // Assert value is correctly formatted
  expect(wrapper.find('input').element.value).to.equal('00');
});

test('should emit keydown event if arrow-keys is false', async () => {
  // Initialize component
  const wrapper = mount(IntegerInput, {
    propsData: { arrowKeys: false },
  });

  // Try to increment value
  await wrapper.trigger('keydown', { key: 'ArrowUp' });

  // Assert keydown event emitted
  expect(wrapper.emitted().keydown.length).to.equal(1);
});
