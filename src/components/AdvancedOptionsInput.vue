<template>
  <div>
    Default units:
    <select v-model="defaultUnitSystem" aria-label="Default units">
      <option value="imperial">Miles</option>
      <option value="metric">Kilometers</option>
    </select>
  </div>

  <div>
    Target set:
    <target-set-selector :setType="props.type" :default-unit-system="defaultUnitSystem"
      v-model:selected-target-set="options.selectedTargetSet" v-model:target-sets="targetSets"
      :customWorkoutNames="props.type === Calculators.Workout ?
      (options as WorkoutOptions).customTargetNames : false"/>
  </div>

  <div v-if="props.type === Calculators.Workout">
    Target name customization:
    <select v-model="(options as WorkoutOptions).customTargetNames"
      aria-label="Target name customization">
      <option :value="false">Disabled</option>
      <option :value="true">Enabled</option>
    </select>
  </div>

  <div v-if="batchOptions && props.batchInput && props.type === Calculators.Workout"
       v-show="(options as WorkoutOptions).customTargetNames">
    Batch column label:
    <input v-model="batchOptions.label" :placeholder="formatDistance(props.batchInput, false)"
           aria-label="Batch column label"/>
  </div>

  <div v-if="props.type === Calculators.Race || props.type === Calculators.Workout">
    Prediction model:
    <select v-model="(options as RaceOptions).model" aria-label="Prediction model">
      <option :value="RacePredictionModels.AverageModel">Average</option>
      <option :value="RacePredictionModels.PurdyPointsModel">Purdy Points Model</option>
      <option :value="RacePredictionModels.VO2MaxModel">V&#775;O&#8322; Max Model</option>
      <option :value="RacePredictionModels.CameronModel">Cameron's Model</option>
      <option :value="RacePredictionModels.RiegelModel">Riegel's Model</option>
    </select>
  </div>

  <div v-if="props.type === Calculators.Race || props.type === Calculators.Workout"
       v-show="(options as RaceOptions).model == RacePredictionModels.AverageModel ||
               (options as RaceOptions).model == RacePredictionModels.RiegelModel">
    Riegel exponent:
    <decimal-input v-model="(options as RaceOptions).riegelExponent"
      aria-label="Riegel exponent" :min="1" :max="1.3" :digits="2" :step="0.01"/>
      (default: 1.06)
  </div>
</template>

<script setup lang="ts">
import { Calculators } from '@/core/calculators';
import type { BatchOptions, StandardOptions, RaceOptions,
  WorkoutOptions } from '@/core/calculators';
import { RacePredictionModels } from '@/core/racePrediction';
import type { TargetSets } from '@/core/targets';
import { UnitSystems, formatDistance } from '@/core/units';
import type { DistanceTime } from '@/core/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useObjectModel from '@/composables/useObjectModel';

type CalculatorOptions = StandardOptions | RaceOptions | WorkoutOptions;

/*
 * The default unit system
 */
const defaultUnitSystem = defineModel<UnitSystems>('defaultUnitSystem');

const props = defineProps<{
  /*
   * The batch calculator input (if applicable, used to generate custom batch label placeholder)
   */
  batchInput?: DistanceTime,

  /*
   * The batch calculator options (if applicable)
   */
  batchOptions?: BatchOptions,

  /*
   * The calculator options
   */
  options: CalculatorOptions,

  /*
   * The calculator type
   */
  type: Calculators,

  /*
   * The calculator target sets
   */
  targetSets: TargetSets,
}>();

// Generate internal refs tied to options and targetSets props
const emit = defineEmits(['update:batchOptions', 'update:options', 'update:targetSets']);
const batchOptions = useObjectModel<BatchOptions | undefined>(() => props.batchOptions, (x) =>
  emit('update:batchOptions', x));
const options = useObjectModel<CalculatorOptions>(() => props.options, (x) =>
  emit('update:options', x));
const targetSets = useObjectModel<TargetSets>(() => props.targetSets, (x) =>
  emit('update:targetSets', x));
</script>
