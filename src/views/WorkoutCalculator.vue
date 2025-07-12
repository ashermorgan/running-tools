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
      <advanced-options-input v-model:defaultUnitSystem="defaultUnitSystem"
        v-model:options="options" v-model:targetSets="targetSets" :type="Calculators.Workout"/>
    </details>

    <h2>Workout Splits</h2>
    <single-output-table class="output"
      :calculate-result="x => calculateWorkoutResults(input, x as WorkoutTarget, options, true)"
      :targets="targetSets[options.selectedTargetSet] ?
      targetSets[options.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { Calculators, calculateWorkoutResults, defaultInput,
  defaultWorkoutOptions } from '@/core/calculators';
import type { WorkoutOptions } from '@/core/calculators';
import { defaultWorkoutTargetSets } from '@/core/targets';
import type { WorkoutTarget, WorkoutTargetSets } from '@/core/targets';
import { UnitSystems, detectDefaultUnitSystem } from '@/core/units';
import type { DistanceTime } from '@/core/units';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';

import useStorage from '@/composables/useStorage';

/*
 * The input race
 */
const input = useStorage<DistanceTime>('workout-calculator-input', defaultInput);

/*
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

/*
 * The race prediction options
 */
const options = useStorage<WorkoutOptions>('workout-calculator-options', defaultWorkoutOptions);

/*
 * The target sets
 */
const targetSets = useStorage<WorkoutTargetSets>('workout-calculator-target-sets',
  defaultWorkoutTargetSets);
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
