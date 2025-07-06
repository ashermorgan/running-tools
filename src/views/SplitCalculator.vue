<template>
  <div class="calculator">
    <div class="input">
      <advanced-options-input v-model:defaultUnitSystem="defaultUnitSystem"
        v-model:options="options" v-model:targetSets="targetSets" :type="Calculators.Split"/>
    </div>

    <div class="output">
      <split-output-table :default-unit-system="defaultUnitSystem" v-model="targetSet"/>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Calculators } from '@/utils/calculators';
import type { StandardOptions } from '@/utils/calculators';
import { defaultTargetSets } from '@/utils/targets';
import type { SplitTargetSet, SplitTargetSets } from '@/utils/targets';
import { UnitSystems, detectDefaultUnitSystem } from '@/utils/units';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import SplitOutputTable from '@/components/SplitOutputTable.vue';

import useStorage from '@/composables/useStorage';

/*
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

/*
 * The split calculator options
 */
const options = useStorage<StandardOptions>('split-calculator-options', {
  selectedTargetSet: '_split_targets'
});

/*
 * The default output targets
 */
const targetSets = useStorage<SplitTargetSets>('split-calculator-target-sets', {
  _split_targets: defaultTargetSets._split_targets as SplitTargetSet
});

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
