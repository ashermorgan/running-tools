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
      <advanced-options-input v-model:defaultUnitSystem="defaultUnitSystem"
        v-model:options="calcOptions" v-model:targetSets="targetSets" :type="options.calculator"/>
    </details>

    <h2>Batch Results</h2>
    <double-output-table class="output" :input-times="inputTimes" :input-distance="inputDistance"
      :calculate-result="calculateResult"
      :targets="targetSets[calcOptions.selectedTargetSet] ?
      targetSets[calcOptions.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import * as calcUtils from '@/utils/calculators';
import type { RaceOptions, StandardOptions, TargetResult,
  WorkoutOptions } from '@/utils/calculators';
import { RacePredictionModel } from '@/utils/races';
import * as targetUtils from '@/utils/targets';
import { DistanceUnits, UnitSystems, detectDefaultUnitSystem } from '@/utils/units';
import type { Distance, DistanceTime } from '@/utils/units';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import DoubleOutputTable from '@/components/DoubleOutputTable.vue';
import IntegerInput from '@/components/IntegerInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import TimeInput from '@/components/TimeInput.vue';

import useStorage from '@/composables/useStorage';

/*
 * The type for options specific to the batch calculator
 */
interface BatchCalculatorOptions {
  calculator: calcUtils.Calculators,
  increment: number,
  rows: number,
};

/*
 * The input pace
 */
const input = useStorage<DistanceTime>('batch-calculator-input', {
  distanceValue: 5,
  distanceUnit: DistanceUnits.Kilometers,
  time: 1200,
});

/*
 * The batch input options
 */
const options = useStorage<BatchCalculatorOptions>('batch-calculator-options', {
  calculator: calcUtils.Calculators.Workout,
  increment: 15,
  rows: 20,
});

/*
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

/*
 * The target sets for each calculator
 */
const paceTargetSets = useStorage<targetUtils.StandardTargetSets>('pace-calculator-target-sets', {
  _pace_targets: targetUtils.defaultTargetSets._pace_targets as targetUtils.StandardTargetSet
});
const raceTargetSets = useStorage<targetUtils.StandardTargetSets>('race-calculator-target-sets', {
  _race_targets: targetUtils.defaultTargetSets._race_targets as targetUtils.StandardTargetSet
});
const workoutTargetSets = useStorage<targetUtils.WorkoutTargetSets>('workout-calculator-target-sets', {
  _workout_targets: targetUtils.defaultTargetSets._workout_targets as targetUtils.WorkoutTargetSet
});

/*
 * The options for each calculator
 */
const paceOptions = useStorage<StandardOptions>('pace-calculator-options', {
  selectedTargetSet: '_pace_targets',
});
const raceOptions = useStorage<RaceOptions>('race-calculator-options', {
  model: RacePredictionModel.AverageModel,
  riegelExponent: 1.06,
  selectedTargetSet: '_race_targets',
});
const workoutOptions = useStorage<WorkoutOptions>('workout-calculator-options', {
  customTargetNames: false,
  model: RacePredictionModel.AverageModel,
  riegelExponent: 1.06,
  selectedTargetSet: '_workout_targets',
});

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
      case (calcUtils.Calculators.Pace): {
        return paceTargetSets.value;
      }
      case (calcUtils.Calculators.Race): {
        return raceTargetSets.value;
      }
      default:
      case (calcUtils.Calculators.Workout): {
        return workoutTargetSets.value;
      }
    }
  },
  set: (newValue: targetUtils.TargetSets) => {
    switch (options.value.calculator) {
      case (calcUtils.Calculators.Pace): {
        paceTargetSets.value = newValue as targetUtils.StandardTargetSets;
        break;
      }
      case (calcUtils.Calculators.Race): {
        raceTargetSets.value = newValue as targetUtils.StandardTargetSets;
        break;
      }
      default:
      case (calcUtils.Calculators.Workout): {
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
      case (calcUtils.Calculators.Pace): {
        return paceOptions.value;
      }
      case (calcUtils.Calculators.Race): {
        return raceOptions.value;
      }
      default:
      case (calcUtils.Calculators.Workout): {
        return workoutOptions.value;
      }
    }
  },
  set: (newValue: StandardOptions | RaceOptions | WorkoutOptions) => {
    switch(options.value.calculator) {
      case (calcUtils.Calculators.Pace): {
        paceOptions.value = newValue as StandardOptions;
        break;
      }
      case (calcUtils.Calculators.Race): {
        raceOptions.value = newValue as RaceOptions;
        break;
      }
      default:
      case (calcUtils.Calculators.Workout): {
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
    case (calcUtils.Calculators.Pace): {
      return (x,y) => calcUtils.calculatePaceResults(x, y, defaultUnitSystem.value, false);
    }
    case (calcUtils.Calculators.Race): {
      return (x,y) => calcUtils.calculateRaceResults(x, y, raceOptions.value,
        defaultUnitSystem.value, false);
    }
    default:
    case (calcUtils.Calculators.Workout): {
      return (x,y) => calcUtils.calculateWorkoutResults(x, y as targetUtils.WorkoutTarget,
        workoutOptions.value, false);
    }
  }
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
