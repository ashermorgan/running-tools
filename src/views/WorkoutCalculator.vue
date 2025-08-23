<template>
  <div class="calculator">
    <h2>Input Race Result</h2>
    <div class="input">
      <pace-input v-model="workoutOptions.input" label="Input race"/>
    </div>

    <details>
      <summary>
        <h2>Advanced Options</h2>
      </summary>
      <advanced-options-input v-model:globalOptions="globalOptions"
        v-model:options="workoutOptions" v-model:targetSets="targetSets" :type="Calculators.Workout"/>
    </details>

    <h2>Workout Splits</h2>
    <single-output-table class="output" :calculate-result="x =>
      calculateWorkoutResults(workoutOptions.input, x as WorkoutTarget,
      globalOptions.racePredictionOptions, workoutOptions.customTargetNames, true)"
      :targets="targetSets[workoutOptions.selectedTargetSet] ?
      targetSets[workoutOptions.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { Calculators, calculateWorkoutResults, defaultGlobalOptions,
  defaultWorkoutOptions } from '@/core/calculators';
import type { GlobalOptions, WorkoutOptions } from '@/core/calculators';
import { defaultWorkoutTargetSets } from '@/core/targets';
import type { WorkoutTarget, WorkoutTargetSets } from '@/core/targets';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';

import useStorage from '@/composables/useStorage';

/*
 * The global options
 */
const globalOptions = useStorage<GlobalOptions>('global-options', defaultGlobalOptions);

/*
 * The race prediction options
 */
const workoutOptions = useStorage<WorkoutOptions>('workout-calculator-options', defaultWorkoutOptions);

/*
 * The target sets
 */
const targetSets = useStorage<WorkoutTargetSets>('workout-calculator-target-sets',
  defaultWorkoutTargetSets);
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
