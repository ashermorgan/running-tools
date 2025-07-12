<template>
  <div class="calculator">
    <h2>Input Pace</h2>
    <div class="input">
      <pace-input v-model="input"/>
    </div>

    <details>
      <summary>
        <h2>Advanced Options</h2>
      </summary>
      <advanced-options-input v-model:defaultUnitSystem="defaultUnitSystem"
        v-model:options="options" v-model:targetSets="targetSets" :type="Calculators.Pace"/>
    </details>

    <h2>Equivalent Paces</h2>
    <single-output-table class="output" :calculate-result="x =>
      calculatePaceResults(input, x, defaultUnitSystem, true)"
     :targets="targetSets[options.selectedTargetSet] ?
     targetSets[options.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { Calculators, calculatePaceResults, defaultInput,
  defaultPaceOptions } from '@/utils/calculators';
import type { StandardOptions } from '@/utils/calculators';
import { defaultPaceTargetSets } from '@/utils/targets';
import type { StandardTargetSets } from '@/utils/targets';
import { UnitSystems, detectDefaultUnitSystem } from '@/utils/units';
import type { DistanceTime } from '@/utils/units';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';

import useStorage from '@/composables/useStorage';

/*
 * The input pace
 */
const input = useStorage<DistanceTime>('pace-calculator-input', defaultInput);

/*
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

/*
 * The current selected target set
 */
const options = useStorage<StandardOptions>('pace-calculator-options', defaultPaceOptions);

/*
 * The target sets
 */
const targetSets = useStorage<StandardTargetSets>('pace-calculator-target-sets',
  defaultPaceTargetSets);
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
