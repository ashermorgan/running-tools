import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import PaceInput from '@/components/PaceInput.vue';

test('should be initialized to modelValue', () => {
  // Initialize component
  const wrapper = shallowMount(PaceInput, {
    propsData: {
      modelValue: {
        distanceValue: 3,
        distanceUnit: 'miles',
        time: 1000,
      }
    },
  });

  // Assert input fields are correct
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(3);
  expect(wrapper.find('select').element.value).to.equal('miles');
  expect(wrapper.findComponent({ name: 'time-input' }).vm.modelValue).to.equal(1000);
});

test('should emit event when inputs are modified', async () => {
  // Initialize component
  const wrapper = shallowMount(PaceInput, {
    propsData: {
      modelValue: {
        distanceValue: 5,
        distanceUnit: 'kilometers',
        time: 1200,
      },
    },
  });

  // Update distance value
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(3);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      distanceValue: 3,
      distanceUnit: 'kilometers',
      time: 1200,
    }],
  ]);

  // Update distance unit
  await wrapper.find('select').setValue('miles');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      distanceValue: 3,
      distanceUnit: 'kilometers',
      time: 1200,
    }],
    [{
      distanceValue: 3,
      distanceUnit: 'miles',
      time: 1200,
    }],
  ]);

  // Update time
  await wrapper.findComponent({ name: 'time-input' }).setValue(1000);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      distanceValue: 3,
      distanceUnit: 'kilometers',
      time: 1200,
    }],
    [{
      distanceValue: 3,
      distanceUnit: 'miles',
      time: 1200,
    }],
    [{
      distanceValue: 3,
      distanceUnit: 'miles',
      time: 1000,
    }],
  ]);
});
