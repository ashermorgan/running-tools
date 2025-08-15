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
      <advanced-options-input :batch-input="input" v-model:batch-options="options"
        v-model:defaultUnitSystem="defaultUnitSystem" v-model:options="calcOptions"
        v-model:targetSets="targetSets" :type="options.calculator"/>
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
import type { BatchOptions, RaceOptions, StandardOptions, TargetResult,
  WorkoutOptions } from '@/core/calculators';
import * as targetUtils from '@/core/targets';
import { UnitSystems, detectDefaultUnitSystem, formatDistance } from '@/core/units';
import type { Distance, DistanceTime } from '@/core/units';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import DoubleOutputTable from '@/components/DoubleOutputTable.vue';
import IntegerInput from '@/components/IntegerInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import TimeInput from '@/components/TimeInput.vue';

import useStorage from '@/composables/useStorage';

/*
 * The input pace
 */
const input = useStorage<DistanceTime>('batch-calculator-input', calculators.defaultInput);

/*
 * The batch input options
 */
const options = useStorage<BatchOptions>('batch-calculator-options',
  calculators.defaultBatchOptions);

/*
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

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
 * The options for each calculator
 */
const paceOptions = useStorage<StandardOptions>('pace-calculator-options',
  calculators.defaultPaceOptions);
const raceOptions = useStorage<RaceOptions>('race-calculator-options',
  calculators.defaultRaceOptions);
const workoutOptions = useStorage<WorkoutOptions>('workout-calculator-options',
  calculators.defaultWorkoutOptions);

/*
 * The input distance
 */
const inputDistance = computed<Distance>(() => ({
  distanceValue: input.value.distanceValue,
  distanceUnit: input.value.distanceUnit,
}));

/*
 * The set of input times
 */
const inputTimes = computed<Array<number>>(() => {
  const results = [];
  for (let i = 0; i < options.value.rows; i++) {
    results.push(input.value.time + options.value.increment * i);
  }
  return results;
});

/*
 * The target sets for the current calculator
 */
const targetSets = computed<targetUtils.TargetSets>({
  get: () => {
    switch (options.value.calculator) {
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
    switch (options.value.calculator) {
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
const calcOptions = computed<StandardOptions | RaceOptions | WorkoutOptions>({
  get: () => {
    switch (options.value.calculator) {
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
  set: (newValue: StandardOptions | RaceOptions | WorkoutOptions) => {
    switch(options.value.calculator) {
      case (calculators.Calculators.Pace): {
        paceOptions.value = newValue as StandardOptions;
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
  switch(options.value.calculator) {
    case (calculators.Calculators.Pace): {
      return (x,y) => calculators.calculatePaceResults(x, y, defaultUnitSystem.value, false);
    }
    case (calculators.Calculators.Race): {
      return (x,y) => calculators.calculateRaceResults(x, y, raceOptions.value.predictionOptions,
        defaultUnitSystem.value, false);
    }
    default:
    case (calculators.Calculators.Workout): {
      return (x,y) => calculators.calculateWorkoutResults(x, y as targetUtils.WorkoutTarget,
        workoutOptions.value.predictionOptions, workoutOptions.value.customTargetNames, false);
    }
  }
});

/*
 * The label to render for the batch column
 */
const batchColumnLabel = computed<string>(() => {
  if (options.value.calculator == calculators.Calculators.Workout &&
    (calcOptions.value as WorkoutOptions).customTargetNames && options.value.label) {
    return options.value.label;
  } else {
    return formatDistance(input.value, false);
  }
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
