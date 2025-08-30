import { test, expect } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';
import PaceInput from '@/components/PaceInput.vue';

test('should correctly render input label', () => {
  // Initialize component
  const wrapper = mount(PaceInput, {
    propsData: {
      modelValue: {
        distanceValue: 3,
        distanceUnit: 'miles',
        time: 1000,
      },
      label: 'My input',
    },
  });

  // Assert input fields are correct
  expect(wrapper.findAll('input')[0].element.ariaLabel).to.equal('My input distance value');
  expect(wrapper.find('select').element.ariaLabel).to.equal('My input distance unit');
  expect(wrapper.findComponent({ name: 'time-input' }).vm.label).to.equal('My input duration');
});

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
