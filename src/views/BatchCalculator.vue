<template>
  <div class="calculator">
    <h2>Batch Input</h2>
    <div class="input">
      <pace-input v-model="input" aria-label="Input"/>
    </div>

    <h2>Batch Options</h2>
    <div class="input">
      <div>
        Increment:
        <time-input v-model="options.increment" label="Duration increment" :show-hours="false"/>
        &times;
        <integer-input v-model="options.rows" min="1" aria-label="Number of rows"/>
      </div>
      <div>
        Calculator:
        <select aria-label="Calculator" v-model="options.calculator">
          <option value="pace">Pace Calculator</option>
          <option value="race">Race Calculator</option>
          <option value="workout">Workout Calculator</option>
        </select>
      </div>
    </div>

    <details>
      <summary>
        <h2>Advanced Options</h2>
      </summary>
      <div>
        Default units:
        <select v-model="defaultUnitSystem" aria-label="Default units">
          <option value="imperial">Miles</option>
          <option value="metric">Kilometers</option>
        </select>
      </div>
      <div>
        Target Set:
        <target-set-selector v-model:selectedTargetSet="selectedTargetSet"
          :setType="options.calculator === 'workout' ? 'workout' : 'standard'"
          v-model:targetSets="targetSets" :default-unit-system="defaultUnitSystem"/>
      </div>
      <race-options v-if="options.calculator !== 'pace'" v-model="advancedOptions"/>
    </details>

    <h2>Batch Results</h2>
    <double-output-table class="output" :input-times="inputTimes" :input-distance="inputDistance"
      :calculate-result="calculateResult"
      :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import * as calcUtils from '@/utils/calculators';
import { defaultTargetSets } from '@/utils/targets';
import { detectDefaultUnitSystem } from '@/utils/units';

import DoubleOutputTable from '@/components/DoubleOutputTable.vue';
import IntegerInput from '@/components/IntegerInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import RaceOptions from '@/components/RaceOptions.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';
import TimeInput from '@/components/TimeInput.vue';

import useStorage from '@/composables/useStorage';

/**
 * The input pace
 */
const input = useStorage('batch-calculator-input', {
  distanceValue: 5,
  distanceUnit: 'kilometers',
  time: 1200,
});

/**
 * The batch input options
 */
const options = useStorage('batch-calculator-options', {
  calculator: 'workout',
  increment: 15,
  rows: 20,
});

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage('default-unit-system', detectDefaultUnitSystem());

/**
 * The current selected target sets for each calculator
 */
const selectedPaceTargetSet = useStorage('pace-calculator-target-set', '_pace_targets');
const selectedRaceTargetSet = useStorage('race-calculator-target-set', '_race_targets');
const selectedWorkoutTargetSet = useStorage('workout-calculator-target-set', '_workout_targets');

/**
 * The target sets for each calculator
 */
const paceTargetSets = useStorage('pace-calculator-target-sets', {
  _pace_targets: defaultTargetSets._pace_targets
});
const raceTargetSets = useStorage('race-calculator-target-sets', {
  _race_targets: defaultTargetSets._race_targets
});
const workoutTargetSets = useStorage('workout-calculator-target-sets', {
  _workout_targets: defaultTargetSets._workout_targets
});

/**
 * The advanced options for each calculator
 */
const raceOptions = useStorage('race-calculator-options', {
  model: 'AverageModel',
  riegelExponent: 1.06,
});
const workoutOptions = useStorage('workout-calculator-options', {
  model: 'AverageModel',
  riegelExponent: 1.06,
});

/**
 * The input distance
 */
const inputDistance = computed(() => ({
  distanceValue: input.value.distanceValue,
  distanceUnit: input.value.distanceUnit,
}));

/**
 * The set of input times
 */
const inputTimes = computed(() => {
  let results = [];
  for (let i = 0; i < options.value.rows; i++) {
    results.push(input.value.time + options.value.increment * i);
  }
  return results;
});

/**
 * The selected target set for the current calculator
 */
const selectedTargetSet = computed({
  get: () => {
    if (options.value.calculator === 'pace') {
      return selectedPaceTargetSet.value;
    } else if (options.value.calculator === 'race') {
      return selectedRaceTargetSet.value;
    } else {
      return selectedWorkoutTargetSet.value;
    }
  },
  set: (newValue) => {
    if (options.value.calculator === 'pace') {
      selectedPaceTargetSet.value = newValue;
    } else if (options.value.calculator === 'race') {
      selectedRaceTargetSet.value = newValue;
    } else {
      selectedWorkoutTargetSet.value = newValue;
    }
  },
});

/**
 * The target sets for the current calculator
 */
const targetSets = computed(() => {
  if (options.value.calculator === 'pace') {
    return paceTargetSets.value;
  } else if (options.value.calculator === 'race') {
    return raceTargetSets.value;
  } else {
    return workoutTargetSets.value;
  }
});

/**
 * The advanced options for the current calculator
 */
const advancedOptions = computed(() => {
  if (options.value.calculator === 'pace') {
    return {};
  } else if (options.value.calculator === 'race') {
    return raceOptions.value;
  } else {
    return workoutOptions.value;
  }
});

/**
 * The appropriate calculate_results function for the current calculator
 */
const calculateResult = computed(() => {
  if (options.value.calculator === 'pace') {
    return (x,y) => calcUtils.calculatePaceResults(x, y, defaultUnitSystem.value, false);
  } else if (options.value.calculator === 'race') {
    return (x,y) => calcUtils.calculateRaceResults(x, y, raceOptions.value, defaultUnitSystem.value,
      false);
  } else {
    return (x,y) => calcUtils.calculateWorkoutResults(x, y, workoutOptions.value, false);
  }
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
