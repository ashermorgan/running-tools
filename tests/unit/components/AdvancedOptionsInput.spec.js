import { test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';

test('should be correctly render pace options according to props', () => {
  // Initialize component
  const wrapper = shallowMount(AdvancedOptionsInput, {
    propsData: {
      defaultUnitSystem: 'metric',
      options: {
        selectedTargetSet: 'B',
      },
      targetSets: {
        'A': {
          name: '1st target set',
          targets: [
            { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
            { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
            { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
          ],
        },
        'B': {
          name: '2nd target set',
          targets: [
            { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
            { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
            { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
          ],
        },
      },
      type: 'pace',
    },
  });

  // Assert all input fields are correct
  expect(wrapper.find('select[aria-label="Default units"]').element.value).to.equal('metric');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to
    .equal('B');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.targetSets).to.deep.equal({
    'A': {
      name: '1st target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    'B': {
      name: '2nd target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  });
  expect(wrapper.findAll('select[aria-label="Target name customization"]')).to.have
    .length(0);
  expect(wrapper.findAll('input[aria-label="Batch column label"]')).to.have
    .length(0);
  expect(wrapper.findAll('select[aria-label="Prediction model"]')).to.have.length(0);
  expect(wrapper.findAllComponents({ name: 'decimal-input' })).to.have.length(0);
});

test('should be correctly render race options according to props', () => {
  // Initialize component
  const wrapper = shallowMount(AdvancedOptionsInput, {
    propsData: {
      defaultUnitSystem: 'metric',
      options: {
        model: 'PurdyPointsModel',
        riegelExponent: 1.2,
        selectedTargetSet: '_new',
      },
      type: 'race',
      targetSets: {},
    },
  });

  // Assert input fields are correct
  expect(wrapper.find('select[aria-label="Default units"]').element.value).to
    .equal('metric');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to
    .equal('_new');
  expect(wrapper.findAll('select[aria-label="Target name customization"]')).to.have
    .length(0);
  expect(wrapper.findAll('input[aria-label="Batch column label"]')).to.have
    .length(0);
  expect(wrapper.find('select[aria-label="Prediction model"]').element.value).to
    .equal('PurdyPointsModel');
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1.2);
  expect(wrapper.findComponent({ name: 'decimal-input' }).isVisible()).to.equal(false);
});

test('should render riegel exponent field only for supported race prediction models', async () => {
  // Initialize component
  const wrapper = shallowMount(AdvancedOptionsInput, {
    propsData: {
      defaultUnitSystem: 'metric',
      options: {
        model: 'AverageModel',
        riegelExponent: 1.2,
        selectedTargetSet: '_new',
      },
      type: 'race',
      targetSets: {},
    },
    attachTo: document.body,
  });

  // Assert field is visible for Average model
  expect(wrapper.findComponent({ name: 'decimal-input' }).isVisible()).to.equal(true);

  // Assert field is not visible for Purdy Points model
  await wrapper.find('select[aria-label="Prediction model"]').setValue('PurdyPointsModel');
  expect(wrapper.findComponent({ name: 'decimal-input' }).isVisible()).to.equal(false);

  // Assert field is not visible for VO2 Max model
  await wrapper.find('select[aria-label="Prediction model"]').setValue('VO2MaxModel');
  expect(wrapper.findComponent({ name: 'decimal-input' }).isVisible()).to.equal(false);

  // Assert field is not visible for Cameron model
  await wrapper.find('select[aria-label="Prediction model"]').setValue('CameronModel');
  expect(wrapper.findComponent({ name: 'decimal-input' }).isVisible()).to.equal(false);

  // Assert field is not visible for Riegel model
  await wrapper.find('select[aria-label="Prediction model"]').setValue('RiegelModel');
  expect(wrapper.findComponent({ name: 'decimal-input' }).isVisible()).to.equal(true);
});

test('should be correctly render split options according to props', () => {
  // Initialize component
  const wrapper = shallowMount(AdvancedOptionsInput, {
    propsData: {
      defaultUnitSystem: 'metric',
      options: {
        selectedTargetSet: '_new',
      },
      targetSets: {},
      type: 'split',
    },
  });

  // Assert input fields are correct
  expect(wrapper.find('select[aria-label="Default units"]').element.value).to
    .equal('metric');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to
    .equal('_new');
  expect(wrapper.findAll('select[aria-label="Target name customization"]')).to.have
    .length(0);
  expect(wrapper.findAll('input[aria-label="Batch column label"]')).to.have
    .length(0);
  expect(wrapper.findAll('select[aria-label="Prediction model"]')).to.have.length(0);
  expect(wrapper.findAllComponents({ name: 'decimal-input' })).to.have.length(0);
});

test('should be correctly render workout options according to props', () => {
  // Initialize component
  const wrapper = shallowMount(AdvancedOptionsInput, {
    propsData: {
      defaultUnitSystem: 'metric',
      options: {
        customTargetNames: true,
        model: 'PurdyPointsModel',
        riegelExponent: 1.2,
        selectedTargetSet: '_new',
      },
      targetSets: {},
      type: 'workout',
    },
  });

  // Assert input fields are correct
  expect(wrapper.find('select[aria-label="Default units"]').element.value).to.equal('metric');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to
    .equal('_new');
  expect(wrapper.find('select[aria-label="Target name customization"]').element.value).to
    .equal('true');
  expect(wrapper.findAll('input[aria-label="Batch column label"]')).to.have
    .length(0);
  expect(wrapper.find('select[aria-label="Prediction model"]').element.value).to
    .equal('PurdyPointsModel');
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1.2);
});

test('should only show batch column label field when applicable', async () => {
  // Initialize component with workout target name customization enabled
  const wrapper = shallowMount(AdvancedOptionsInput, {
    propsData: {
      defaultUnitSystem: 'metric',
      options: {
        customTargetNames: true,
        model: 'PurdyPointsModel',
        riegelExponent: 1.2,
        selectedTargetSet: '_new',
      },
      targetSets: {},
      type: 'workout',
    },
    attachTo: document.body,
  });

  // Assert batch column label field is hidden
  expect(wrapper.findAll('input[aria-label="Batch column label"]')).to.have
    .length(0);

  // Add batchInput and batchOptions but disable workout target name customization
  await wrapper.setProps({
    batchInput: { // added
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    batchOptions: { // added
      calculator: 'workout',
      increment: 32,
      label: 'foo',
      rows: 15,
    },
    defaultUnitSystem: 'metric',
    options: {
      customTargetNames: false, // disabled
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
      selectedTargetSet: '_new',
    },
    targetSets: {},
    type: 'workout',
  });

  // Assert batch column label field is still hidden
  expect(wrapper.find('input[aria-label="Batch column label"]').isVisible()).to.equal(false);

  // Enable workout target name customization
  await wrapper.setProps({
    batchInput: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    batchOptions: {
      calculator: 'workout',
      increment: 32,
      label: 'foo',
      rows: 15,
    },
    defaultUnitSystem: 'metric',
    options: {
      customTargetNames: true, // enabled
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
      selectedTargetSet: '_new',
    },
    targetSets: {},
    type: 'workout',
  });

  // Assert batch column label field is now visible
  expect(wrapper.find('input[aria-label="Batch column label"]').isVisible()).to.equal(true);
  expect(wrapper.find('input[aria-label="Batch column label"]').element.placeholder).to.equal('2 mi')
  expect(wrapper.find('input[aria-label="Batch column label"]').element.value).to.equal('foo')

  // Switch to race calculator
  await wrapper.setProps({
    batchInput: {
      distanceValue: 2,
      distanceUnit: 'miles',
      time: 600,
    },
    batchOptions: {
      calculator: 'workout',
      increment: 32,
      label: 'foo',
      rows: 15,
    },
    defaultUnitSystem: 'metric',
    options: {
      model: 'PurdyPointsModel',
      riegelExponent: 1.2,
      selectedTargetSet: '_new',
    },
    targetSets: {},
    type: 'race', // changed
  });

  // Assert batch column label field is hidden again
  expect(wrapper.findAll('input[aria-label="Batch column label"]')).to.have
    .length(0);
});

test('should pass correct props to TargetSetSelector', async () => {
  // Initialize component
  const wrapper = shallowMount(AdvancedOptionsInput, {
    propsData: {
      defaultUnitSystem: 'metric',
      options: {
        customTargetNames: false,
        model: 'AverageModel',
        riegelExponent: 1.06,
        selectedTargetSet: 'B',
      },
      targetSets: {
        'A': {
          name: '1st target set v2',
          targets: [
            { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
            { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
            { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
          ],
        },
        'B': {
          name: '2nd target set',
          targets: [
            { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
            { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
            { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
          ],
        },
      },
      type: 'workout',
    },
  });

  // Assert props are correct
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet).to.equal('B');
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.targetSets).to.deep.equal({
    'A': {
      name: '1st target set v2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    'B': {
      name: '2nd target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  });
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.customWorkoutNames)
    .to.equal(false);

  // Update options
  await wrapper.find('select[aria-label="Target name customization"]').setValue('true');

  // Assert props are updated
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.customWorkoutNames)
    .to.equal(true);
});

test('should emit input events when options are modified', async () => {
  // Initialize component
  const wrapper = shallowMount(AdvancedOptionsInput, {
    propsData: {
      defaultUnitSystem: 'metric',
      options: {
        customTargetNames: false,
        model: 'AverageModel',
        riegelExponent: 1.06,
        selectedTargetSet: '_new',
      },
      targetSets: {},
      type: 'workout',
    },
  });

  // Update options
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue({
    'A': {
      name: '1st target set v2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    'B': {
      name: '2nd target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  }, 'targetSets');
  await wrapper.findComponent({ name: 'target-set-selector' }).setValue('B', 'selectedTargetSet');
  await wrapper.find('select[aria-label="Target name customization"]').setValue('true');
  await wrapper.find('select[aria-label="Prediction model"]').setValue('CameronModel');
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(1.3);

  // Assert correct update events emitted
  expect(wrapper.emitted()['update:defaultUnitSystem']).to.deep.equal([['imperial']]);
  expect(wrapper.emitted()['update:targetSets']).to.deep.equal([[{
    'A': {
      name: '1st target set v2',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 2, distanceUnit: 'miles' },
        { type: 'distance', distanceValue: 3, distanceUnit: 'miles' },
      ],
    },
    'B': {
      name: '2nd target set',
      targets: [
        { type: 'distance', distanceValue: 1, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 5, distanceUnit: 'kilometers' },
        { type: 'distance', distanceValue: 10, distanceUnit: 'kilometers' },
      ],
    },
  }]]);
  expect(wrapper.emitted()['update:options']).to.deep.equal([
    [{
        customTargetNames: false,
        model: 'AverageModel',
        riegelExponent: 1.06,
        selectedTargetSet: 'B',
    }],
    [{
        customTargetNames: true,
        model: 'AverageModel',
        riegelExponent: 1.06,
        selectedTargetSet: 'B',
    }],
    [{
        customTargetNames: true,
        model: 'CameronModel',
        riegelExponent: 1.06,
        selectedTargetSet: 'B',
    }],
    [{
        customTargetNames: true,
        model: 'CameronModel',
        riegelExponent: 1.3,
        selectedTargetSet: 'B',
    }],
  ]);
});
