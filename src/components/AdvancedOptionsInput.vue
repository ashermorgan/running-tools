<template>
  <div>
    Default units:
    <select v-model="defaultUnitSystem" aria-label="Default units">
      <option value="imperial">Miles</option>
      <option value="metric">Kilometers</option>
    </select>
  </div>

  <div>
    Target Set:
    <target-set-selector :setType="props.type" :default-unit-system="defaultUnitSystem"
      v-model:selected-target-set="options.selectedTargetSet" v-model:target-sets="targetSets"
      :customWorkoutNames="props.type === Calculators.Workout ?
      (options as WorkoutOptions).customTargetNames : false"/>
  </div>

  <div v-if="props.type === Calculators.Workout">
    Target Name Customization:
    <select v-model="(options as WorkoutOptions).customTargetNames"
      aria-label="Target name customization">
      <option :value="false">Disabled</option>
      <option :value="true">Enabled</option>
    </select>
  </div>

  <div v-if="props.type === Calculators.Race || props.type === Calculators.Workout">
    Prediction Model:
    <select v-model="(options as RaceOptions).model" aria-label="Prediction model">
      <option value="AverageModel">Average</option>
      <option value="PurdyPointsModel">Purdy Points Model</option>
      <option value="VO2MaxModel">V&#775;O&#8322; Max Model</option>
      <option value="CameronModel">Cameron's Model</option>
      <option value="RiegelModel">Riegel's Model</option>
    </select>
  </div>

  <div v-if="props.type === Calculators.Race || props.type === Calculators.Workout">
    Riegel Exponent:
    <decimal-input v-model="(options as RaceOptions).riegelExponent"
      aria-label="Riegel exponent" :min="1" :max="1.3" :digits="2" :step="0.01"/>
      (default: 1.06)
  </div>
</template>

<script setup lang="ts">
import { Calculators } from '@/utils/calculators';
import type { CalculatorOptions, RaceOptions, WorkoutOptions } from '@/utils/calculators';
import type { TargetSets } from '@/utils/targets';
import { UnitSystems } from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useObjectModel from '@/composables/useObjectModel';

/*
 * The default unit system
 */
const defaultUnitSystem = defineModel<UnitSystems>('defaultUnitSystem');

const props = defineProps<{
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
const emit = defineEmits(['update:options', 'update:targetSets']);
const options = useObjectModel<CalculatorOptions>(() => props.options, (x) =>
  emit('update:options', x));
const targetSets = useObjectModel<TargetSets>(() => props.targetSets, (x) =>
  emit('update:targetSets', x));
</script>
