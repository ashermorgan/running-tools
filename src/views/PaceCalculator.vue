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
      <div>
        Default units:
        <select v-model="defaultUnitSystem" aria-label="Default units">
          <option value="imperial">Miles</option>
          <option value="metric">Kilometers</option>
        </select>
      </div>
      <div>
        Target Set:
        <target-set-selector v-model:selectedTargetSet="selectedTargetSet"
          v-model:targetSets="targetSets" :default-unit-system="defaultUnitSystem"/>
      </div>
    </details>

    <h2>Equivalent Paces</h2>
    <single-output-table class="output" :calculate-result="x =>
      calcUtils.calculatePaceResults(input, x, defaultUnitSystem)"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup>
import calcUtils from '@/utils/calculators';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import PaceInput from '@/components/PaceInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/**
 * The input pace
 */
const input = useStorage('pace-calculator-input', {
  distanceValue: 5,
  distanceUnit: 'kilometers',
  time: 1200,
});

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage('default-unit-system', unitUtils.detectDefaultUnitSystem());

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage('pace-calculator-target-set', '_pace_targets');

/**
 * The target sets
 */
const targetSets = useStorage('pace-calculator-target-sets', {
  _pace_targets: targetUtils.defaultTargetSets._pace_targets
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
