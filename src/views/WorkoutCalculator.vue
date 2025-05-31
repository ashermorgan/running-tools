<template>
  <div class="calculator">
    <h2>Input Race Result</h2>
    <div class="input">
      <pace-input v-model="input" label="Input race"/>
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
        <target-set-selector v-model:selectedTargetSet="selectedTargetSet" setType="workout"
          :customWorkoutNames="options.customTargetNames" v-model:targetSets="targetSets"
          :default-unit-system="defaultUnitSystem"/>
      </div>
      <div>
        Target Name Customization:
        <select v-model="options.customTargetNames" aria-label="Target name customization">
          <option :value="false">Disabled</option>
          <option :value="true">Enabled</option>
        </select>
      </div>
      <race-options v-model="options"/>
    </details>

    <h2>Workout Splits</h2>
    <single-output-table class="output"
      :calculate-result="x => calculateWorkoutResults(input, x, options, true)"
      :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup>
import { calculateWorkoutResults } from '@/utils/calculators';
import { defaultTargetSets } from '@/utils/targets';
import { detectDefaultUnitSystem } from '@/utils/units';

import PaceInput from '@/components/PaceInput.vue';
import RaceOptions from '@/components/RaceOptions.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/**
 * The input race
 */
const input = useStorage('workout-calculator-input', {
  distanceValue: 5,
  distanceUnit: 'kilometers',
  time: 1200,
});

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage('default-unit-system', detectDefaultUnitSystem());

/**
 * The race prediction options
 */
const options = useStorage('workout-calculator-options', {
  customTargetNames: false,
  model: 'AverageModel',
  riegelExponent: 1.06,
});

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage('workout-calculator-target-set', '_workout_targets');

/**
 * The target sets
 */
let targetSets = useStorage('workout-calculator-target-sets', {
  _workout_targets: defaultTargetSets._workout_targets
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
