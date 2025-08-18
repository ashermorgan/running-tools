<template>
  <div class="calculator">
    <div class="input">
      <advanced-options-input v-model:globalOptions="globalOptions"
        v-model:options="options" v-model:targetSets="targetSets" :type="Calculators.Split"/>
    </div>

    <div class="output">
      <split-output-table :default-unit-system="globalOptions.defaultUnitSystem"
        v-model="targetSet"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Calculators, defaultGlobalOptions, defaultSplitOptions } from '@/core/calculators';
import type { GlobalOptions, StandardOptions } from '@/core/calculators';
import { defaultSplitTargetSets } from '@/core/targets';
import type { SplitTargetSets } from '@/core/targets';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import SplitOutputTable from '@/components/SplitOutputTable.vue';

import useStorage from '@/composables/useStorage';

/*
 * The global options
 */
const globalOptions = useStorage<GlobalOptions>('global-options', defaultGlobalOptions);

/*
 * The split calculator options
 */
const options = useStorage<StandardOptions>('split-calculator-options', defaultSplitOptions);

/*
 * The split calculator target sets
 */
const targetSets = useStorage<SplitTargetSets>('split-calculator-target-sets',
  defaultSplitTargetSets);

/*
 * The active target set
 */
const targetSet = computed({
  get: () => {
    if (targetSets.value[options.value.selectedTargetSet]) {
      return targetSets.value[options.value.selectedTargetSet].targets
    } else {
      return []
    }
  },
  set: (newValue) => {
    if (targetSets.value[options.value.selectedTargetSet]) {
      targetSets.value[options.value.selectedTargetSet].targets = newValue;
    }
  },
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';

/* Widen default calculator output */
@media only screen and (min-width: 501px) {
  .output {
    min-width: 400px;
  }
}
</style>
