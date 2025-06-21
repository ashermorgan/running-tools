import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RaceOptions from '@/components/RaceOptions.vue';

test('should be initialized to modelValue', () => {
  // Initialize component
  const wrapper = shallowMount(RaceOptions, {
    propsData: {
      modelValue: {
        model: 'PurdyPointsModel',
        riegelExponent: 1.2,
      }
    },
  });

  // Assert input fields are correct
  expect(wrapper.find('select').element.value).to.equal('PurdyPointsModel');
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1.2);
});

test('should emit event when inputs are modified', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceOptions);

  // Update model
  await wrapper.find('select').setValue('CameronModel');
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      model: 'CameronModel',
      riegelExponent: 1.06,
    }],
  ]);

  // Update Riegel exponent
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(1.3);
  expect(wrapper.emitted()['update:modelValue']).to.deep.equal([
    [{
      model: 'CameronModel',
      riegelExponent: 1.06,
    }],
    [{
      model: 'CameronModel',
      riegelExponent: 1.3,
    }],
  ]);
});
