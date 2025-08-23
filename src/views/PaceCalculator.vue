<template>
  <div class="calculator">
    <h2>Input Pace</h2>
    <div class="input">
      <pace-input v-model="paceOptions.input"/>
    </div>

    <details>
      <summary>
        <h2>Advanced Options</h2>
      </summary>
      <advanced-options-input v-model:globalOptions="globalOptions"
        v-model:options="paceOptions" v-model:targetSets="targetSets" :type="Calculators.Pace"/>
    </details>

    <h2>Equivalent Paces</h2>
    <single-output-table class="output" :calculate-result="x =>
      calculatePaceResults(paceOptions.input, x, globalOptions.defaultUnitSystem, true)"
     :targets="targetSets[paceOptions.selectedTargetSet] ?
     targetSets[paceOptions.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { Calculators, calculatePaceResults, defaultGlobalOptions,
  defaultPaceOptions } from '@/core/calculators';
import type { GlobalOptions, PaceOptions } from '@/core/calculators';
import { defaultPaceTargetSets } from '@/core/targets';
import type { StandardTargetSets } from '@/core/targets';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';

import useStorage from '@/composables/useStorage';

/*
 * The global options
 */
const globalOptions = useStorage<GlobalOptions>('global-options', defaultGlobalOptions);

/*
 * The pace calculator options
 */
const paceOptions = useStorage<PaceOptions>('pace-calculator-options', defaultPaceOptions);

/*
 * The target sets
 */
const targetSets = useStorage<StandardTargetSets>('pace-calculator-target-sets',
  defaultPaceTargetSets);
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
