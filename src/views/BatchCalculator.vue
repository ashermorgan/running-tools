<template>
  <div class="calculator">
    <h2>Batch Input</h2>
    <div class="input">
      <pace-input v-model="batchOptions.input" aria-label="Input"/>
    </div>

    <h2>Batch Options</h2>
    <div class="input">
      <div>
        Increment:
        <time-input v-model="batchOptions.increment" label="Duration increment" :show-hours="false"/>
        &times;
        <integer-input v-model="batchOptions.rows" min="1" aria-label="Number of rows"/>
      </div>
      <div>
        Calculator:
        <select aria-label="Calculator" v-model="batchOptions.calculator">
          <option :value="calculators.Calculators.Pace">Pace Calculator</option>
          <option :value="calculators.Calculators.Race">Race Calculator</option>
          <option :value="calculators.Calculators.Workout">Workout Calculator</option>
        </select>
      </div>
    </div>

    <details>
      <summary>
        <h2>Advanced Options</h2>
      </summary>
      <advanced-options-input v-model:batch-options="batchOptions"
        v-model:globalOptions="globalOptions" v-model:options="calcOptions"
        v-model:targetSets="targetSets" :type="batchOptions.calculator"/>
    </details>

    <h2>Batch Results</h2>
    <double-output-table class="output" :calculate-result="calculateResult"
      :input-distance="inputDistance" :input-times="inputTimes" :label="batchColumnLabel"
      :targets="targetSets[calcOptions.selectedTargetSet] ?
      targetSets[calcOptions.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import * as calculators from '@/core/calculators';
import type { BatchOptions, GlobalOptions, PaceOptions, RaceOptions, TargetResult,
  WorkoutOptions } from '@/core/calculators';
import * as targetUtils from '@/core/targets';
import { formatDistance } from '@/core/units';
import type { Distance, DistanceTime } from '@/core/units';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import DoubleOutputTable from '@/components/DoubleOutputTable.vue';
import IntegerInput from '@/components/IntegerInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import TimeInput from '@/components/TimeInput.vue';

import useStorage from '@/composables/useStorage';

/*
 * The global options
 */
const globalOptions = useStorage<GlobalOptions>('global-options', calculators.defaultGlobalOptions);

/*
 * The batch calculator options
 */
const batchOptions = useStorage<BatchOptions>('batch-calculator-options',
  calculators.defaultBatchOptions);

/*
 * The options for each calculator
 */
const paceOptions = useStorage<PaceOptions>('pace-calculator-options',
  calculators.defaultPaceOptions);
const raceOptions = useStorage<RaceOptions>('race-calculator-options',
  calculators.defaultRaceOptions);
const workoutOptions = useStorage<WorkoutOptions>('workout-calculator-options',
  calculators.defaultWorkoutOptions);

/*
 * The target sets for each calculator
 */
const paceTargetSets = useStorage<targetUtils.StandardTargetSets>('pace-calculator-target-sets',
  targetUtils.defaultPaceTargetSets);
const raceTargetSets = useStorage<targetUtils.StandardTargetSets>('race-calculator-target-sets',
  targetUtils.defaultRaceTargetSets);
const workoutTargetSets = useStorage<targetUtils.WorkoutTargetSets>(
  'workout-calculator-target-sets', targetUtils.defaultWorkoutTargetSets);

/*
 * The input distance
 */
const inputDistance = computed<Distance>(() => ({
  distanceValue: batchOptions.value.input.distanceValue,
  distanceUnit: batchOptions.value.input.distanceUnit,
}));

/*
 * The set of input times
 */
const inputTimes = computed<Array<number>>(() => {
  const results = [];
  for (let i = 0; i < batchOptions.value.rows; i++) {
    results.push(batchOptions.value.input.time + batchOptions.value.increment * i);
  }
  return results;
});

/*
 * The target sets for the current calculator
 */
const targetSets = computed<targetUtils.TargetSets>({
  get: () => {
    switch (batchOptions.value.calculator) {
      case (calculators.Calculators.Pace): {
        return paceTargetSets.value;
      }
      case (calculators.Calculators.Race): {
        return raceTargetSets.value;
      }
      default:
      case (calculators.Calculators.Workout): {
        return workoutTargetSets.value;
      }
    }
  },
  set: (newValue: targetUtils.TargetSets) => {
    switch (batchOptions.value.calculator) {
      case (calculators.Calculators.Pace): {
        paceTargetSets.value = newValue as targetUtils.StandardTargetSets;
        break;
      }
      case (calculators.Calculators.Race): {
        raceTargetSets.value = newValue as targetUtils.StandardTargetSets;
        break;
      }
      default:
      case (calculators.Calculators.Workout): {
        workoutTargetSets.value = newValue as targetUtils.WorkoutTargetSets;
        break;
      }
    }
  },
});

/*
 * The options for the current calculator
 */
const calcOptions = computed<PaceOptions | RaceOptions | WorkoutOptions>({
  get: () => {
    switch (batchOptions.value.calculator) {
      case (calculators.Calculators.Pace): {
        return paceOptions.value;
      }
      case (calculators.Calculators.Race): {
        return raceOptions.value;
      }
      default:
      case (calculators.Calculators.Workout): {
        return workoutOptions.value;
      }
    }
  },
  set: (newValue: PaceOptions | RaceOptions | WorkoutOptions) => {
    switch(batchOptions.value.calculator) {
      case (calculators.Calculators.Pace): {
        paceOptions.value = newValue as PaceOptions;
        break;
      }
      case (calculators.Calculators.Race): {
        raceOptions.value = newValue as RaceOptions;
        break;
      }
      default:
      case (calculators.Calculators.Workout): {
        workoutOptions.value = newValue as WorkoutOptions;
        break;
      }
    }
  },
});

/*
 * The appropriate calculate_results function for the current calculator
 */
const calculateResult = computed<(x: DistanceTime, y: targetUtils.Target) => TargetResult>(() => {
  switch(batchOptions.value.calculator) {
    case (calculators.Calculators.Pace): {
      return (x,y) => calculators.calculatePaceResults(x, y, globalOptions.value.defaultUnitSystem,
        false);
    }
    case (calculators.Calculators.Race): {
      return (x,y) => calculators.calculateRaceResults(x, y,
        globalOptions.value.racePredictionOptions, globalOptions.value.defaultUnitSystem, false);
    }
    default:
    case (calculators.Calculators.Workout): {
      return (x,y) => calculators.calculateWorkoutResults(x, y as targetUtils.WorkoutTarget,
        globalOptions.value.racePredictionOptions, workoutOptions.value.customTargetNames, false);
    }
  }
});

/*
 * The label to render for the batch column
 */
const batchColumnLabel = computed<string>(() => {
  if (batchOptions.value.calculator == calculators.Calculators.Workout &&
    (calcOptions.value as WorkoutOptions).customTargetNames && batchOptions.value.label) {
    return batchOptions.value.label;
  } else {
    return formatDistance(batchOptions.value.input, false);
  }
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
