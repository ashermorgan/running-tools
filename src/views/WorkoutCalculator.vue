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
        <target-set-selector v-model:selectedTargetSet="options.selectedTargetSet"
          :set-type="TargetSetTypes.Workout" :customWorkoutNames="options.customTargetNames"
          v-model:targetSets="targetSets" :default-unit-system="defaultUnitSystem"/>
      </div>
      <div>
        Target Name Customization:
        <select v-model="options.customTargetNames" aria-label="Target name customization">
          <option :value="false">Disabled</option>
          <option :value="true">Enabled</option>
        </select>
      </div>
      <race-options-input v-model="options"/>
    </details>

    <h2>Workout Splits</h2>
    <single-output-table class="output"
      :calculate-result="x => calculateWorkoutResults(input, x as WorkoutTarget, options, true)"
      :targets="targetSets[options.selectedTargetSet] ?
      targetSets[options.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { calculateWorkoutResults } from '@/utils/calculators';
import type { WorkoutOptions } from '@/utils/calculators';
import { RacePredictionModel } from '@/utils/races';
import { TargetSetTypes, defaultTargetSets } from '@/utils/targets';
import type { WorkoutTarget, WorkoutTargetSet, WorkoutTargetSets } from '@/utils/targets';
import { DistanceUnits, UnitSystems, detectDefaultUnitSystem } from '@/utils/units';
import type { DistanceTime } from '@/utils/units';

import PaceInput from '@/components/PaceInput.vue';
import RaceOptionsInput from '@/components/RaceOptionsInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/*
 * The input race
 */
const input = useStorage<DistanceTime>('workout-calculator-input', {
  distanceValue: 5,
  distanceUnit: DistanceUnits.Kilometers,
  time: 1200,
});

/*
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

/*
 * The race prediction options
 */
const options = useStorage<WorkoutOptions>('workout-calculator-options', {
  customTargetNames: false,
  model: RacePredictionModel.AverageModel,
  riegelExponent: 1.06,
  selectedTargetSet: '_workout_targets',
});

/*
 * The target sets
 */
const targetSets = useStorage<WorkoutTargetSets>('workout-calculator-target-sets', {
  _workout_targets: defaultTargetSets._workout_targets as WorkoutTargetSet
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
