<template>
  <div class="calculator">
    <div class="default-units">
      Default units:
      <select v-model="defaultUnitSystem" aria-label="Default units">
        <option value="imperial">Miles</option>
        <option value="metric">Kilometers</option>
      </select>
    </div>

    <div class="target-set">
      Target Set:
      <target-set-selector v-model:selectedTargetSet="selectedTargetSet" setType="split"
        v-model:targetSets="targetSets" :default-unit-system="defaultUnitSystem"/>
    </div>

    <div class="output">
      <split-output-table :default-unit-system="defaultUnitSystem" v-model="targetSet"/>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { defaultTargetSets } from '@/utils/targets';
import { detectDefaultUnitSystem } from '@/utils/units';

import SplitOutputTable from '@/components/SplitOutputTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage('default-unit-system', detectDefaultUnitSystem());

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage('split-calculator-target-set', '_split_targets');

/**
 * The default output targets
 */
const targetSets = useStorage('split-calculator-target-sets', {
  _split_targets: defaultTargetSets._split_targets
});

/**
 * The active target set
 */
const targetSet = computed({
  get: () => {
    if (targetSets.value[selectedTargetSet.value]) {
      return targetSets.value[selectedTargetSet.value].targets
    } else {
      return []
    }
  },
  set: (newValue) => {
    if (targetSets.value[selectedTargetSet.value]) {
      targetSets.value[selectedTargetSet.value].targets = newValue;
    }
  },
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';

.target-set, .default-units {
  margin-bottom: 5px;
}

/* Widen default calculator output */
@media only screen and (min-width: 501px) {
  .output {
    min-width: 400px;
  }
}
</style>
