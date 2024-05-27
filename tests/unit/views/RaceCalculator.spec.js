import { beforeEach, test, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import RaceCalculator from '@/views/RaceCalculator.vue';
import targetUtils from '@/utils/targets';

beforeEach(() => {
  localStorage.clear();
})

test('should correctly predict race times', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(5);
  await wrapper.find('select[aria-label="Input distance unit"]').setValue('kilometers');
  await wrapper.findComponent({ name: 'time-input' }).setValue(1200);

  // Calculate result
  const calculateResult = wrapper.findComponent({ name: 'simple-target-table' }).vm.calculateResult;
  const result = calculateResult({
    distanceValue: 10,
    distanceUnit: 'kilometers',
    result: 'time',
  });

  // Assert result is correct
  expect(result.time).to.be.closeTo(2495, 1);
  expect(result.distanceValue).to.equal(10);
  expect(result.distanceUnit).to.equal('kilometers');
  expect(result.result).to.equal('time');
});

test('should correctly calculate distance results according to default units setting', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(5);
  await wrapper.find('select[aria-label="Input distance unit"]').setValue('kilometers');
  await wrapper.findComponent({ name: 'time-input' }).setValue(1200);

  // Set default units
  await wrapper.find('select[aria-label="Default units"]').setValue('metric');

  // Get calculate result function
  const calculateResult = wrapper.findComponent({ name: 'simple-target-table' }).vm.calculateResult;

  // Assert result is correct
  let result = calculateResult({ result: 'distance', time: 2495 });
  expect(result.distanceValue).to.be.closeTo(10, 0.01);
  expect(result.distanceUnit).to.equal('kilometers');
  expect(result.time).to.equal(2495);
  expect(result.result).to.equal('distance');

  // Change default units
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');

  // Assert result is correct
  result = calculateResult({ result: 'distance', time: 2495 });
  expect(result.distanceValue).to.be.closeTo(6.214, 0.01);
  expect(result.distanceUnit).to.equal('miles');
  expect(result.time).to.equal(2495);
  expect(result.result).to.equal('distance');
});

test('should show paces in results table', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert paces are shown in results table
  expect(wrapper.findComponent({ name: 'simple-target-table' }).vm.showPace).to.equal(true);
});

test('should correctly handle null target set', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);
  await wrapper.vm.reloadTargets(); // onActivated method not called in tests

  // Switch to invalid target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('does_not_exist', 'selectedTargetSet');

  // Assert empty array passed to SimpleTargetTable component
  expect(wrapper.findComponent({ name: 'simple-target-table' }).vm.targets).to.deep.equal([]);

  // Switch to valid target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('_race_targets', 'selectedTargetSet');

  // Assert valid targets passed to SimpleTargetTable component
  const raceTargets = targetUtils.defaultTargetSets._race_targets.targets;
  expect(wrapper.findComponent({ name: 'simple-target-table' }).vm.targets)
    .to.deep.equal(raceTargets);
});

test('should correctly calculate race statistics', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(5);
  await wrapper.find('select[aria-label="Input distance unit"]').setValue('kilometers');
  await wrapper.findComponent({ name: 'time-input' }).setValue(1200);

  // Get race statistics
  const raceStats = wrapper.findAll('details')[0];
  const purdyPoints = raceStats.findAll('div')[0].element.textContent.trim();
  const vo2 = raceStats.findAll('div')[1].element.textContent.trim();
  const vo2Max = raceStats.findAll('div')[2].element.textContent.trim();

  // Assert race statistics are correct
  expect(purdyPoints).to.equal('Purdy Points: 454.5');
  expect(vo2).to.equal('V̇O₂: 47.4 ml/kg/min (95.3% of max)')
  expect(vo2Max).to.equal('V̇O₂ Max: 49.8 ml/kg/min')
});

test('should correctly calculate results according to advanced model options', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(5);
  await wrapper.find('select[aria-label="Input distance unit"]').setValue('kilometers');
  await wrapper.findComponent({ name: 'time-input' }).setValue(1200);

  // Switch model
  await wrapper.find('select[aria-label="Prediction model"]').setValue('RiegelModel');

  // Calculate result
  const calculateResult = wrapper.findComponent({ name: 'simple-target-table' }).vm.calculateResult;
  let result = calculateResult({
    distanceValue: 10,
    distanceUnit: 'kilometers',
    result: 'time',
  });

  // Assert result is correct
  expect(result.time).to.be.closeTo(2502, 1);

  // Update Riegel Exponent
  expect(wrapper.findComponent('[aria-label="Riegel exponent"').vm.modelValue).to.equal(1.06);
  await wrapper.findComponent('[aria-label="Riegel exponent"').setValue(1);

  // Calculate result
  result = calculateResult({
    distanceValue: 10,
    distanceUnit: 'kilometers',
    result: 'time',
  });

  // Assert result is correct
  expect(result.time).to.equal(2400);
});

test('should load input pace from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.race-calculator-input-distance', '1');
  localStorage.setItem('running-tools.race-calculator-input-unit', '"miles"');
  localStorage.setItem('running-tools.race-calculator-input-time', '600');

  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert data loaded
  expect(wrapper.findComponent({ name: 'decimal-input' }).vm.modelValue).to.equal(1);
  expect(wrapper.find('select[aria-label="Input distance unit"]').element.value).to.equal('miles');
  expect(wrapper.findComponent({ name: 'time-input' }).vm.modelValue).to.equal(600);
});

test('should save input pace to localStorage', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Enter input pace data
  await wrapper.findComponent({ name: 'decimal-input' }).setValue(1);
  await wrapper.find('select[aria-label="Input distance unit"]').setValue('miles');
  await wrapper.findComponent({ name: 'time-input' }).setValue(600);

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.race-calculator-input-distance')).to.equal('1');
  expect(localStorage.getItem('running-tools.race-calculator-input-unit')).to.equal('"miles"');
  expect(localStorage.getItem('running-tools.race-calculator-input-time')).to.equal('600');
});

test('should load selected target set from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.race-calculator-target-set', '"_pace_targets"');

  // Initialize component
  const wrapper = shallowMount(RaceCalculator);
  await wrapper.vm.reloadTargets();

  // Assert selection is loaded
  expect(wrapper.findComponent({ name: 'target-set-selector' }).vm.selectedTargetSet)
    .to.equal('_pace_targets');
  const paceTargets = targetUtils.defaultTargetSets._pace_targets.targets;
  expect(wrapper.findComponent({ name: 'simple-target-table' }).vm.targets)
    .to.deep.equal(paceTargets);
});

test('should save selected target set to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Select a new target set
  await wrapper.findComponent({ name: 'target-set-selector' })
    .setValue('_pace_targets', 'selectedTargetSet');

  // New selected target set should be saved to localStorage
  expect(localStorage.getItem('running-tools.race-calculator-target-set'))
    .to.equal('"_pace_targets"');
});

test('should save default units setting to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Change default units
  await wrapper.find('select[aria-label="Default units"]').setValue('metric');
  await wrapper.find('select[aria-label="Default units"]').setValue('imperial');

  // New default units should be saved to localStorage
  expect(localStorage.getItem('running-tools.default-unit-system')).to.equal('"imperial"');
});

test('should load advanced model options from localStorage', async () => {
  // Initialize localStorage
  localStorage.setItem('running-tools.race-calculator-model', '"PurdyPointsModel"');
  localStorage.setItem('running-tools.race-calculator-riegel-exponent', '1.20');

  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Assert data loaded
  expect(wrapper.find('select[aria-label="Prediction model"]').element.value)
    .to.equal('PurdyPointsModel');
  expect(wrapper.findComponent('[aria-label="Riegel exponent"]').vm.modelValue).to.equal(1.20);
});

test('should save advanced model options to localStorage when modified', async () => {
  // Initialize component
  const wrapper = shallowMount(RaceCalculator);

  // Update advanced model options
  await wrapper.find('select[aria-label="Prediction model"]').setValue('CameronModel');
  await wrapper.findComponent('[aria-label="Riegel exponent"]').setValue(1.30);

  // Assert data saved to localStorage
  expect(localStorage.getItem('running-tools.race-calculator-model')).to.equal('"CameronModel"');
  expect(localStorage.getItem('running-tools.race-calculator-riegel-exponent')).to.equal('1.3');
});

