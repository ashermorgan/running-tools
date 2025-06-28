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
      calculatePaceResults(input, x, defaultUnitSystem, true)"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { calculatePaceResults } from '@/utils/calculators';
import { defaultTargetSets } from '@/utils/targets';
import type { StandardTargetSets } from '@/utils/targets';
import { DistanceUnits, UnitSystems, detectDefaultUnitSystem } from '@/utils/units';
import type { DistanceTime } from '@/utils/units';

import PaceInput from '@/components/PaceInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/**
 * The input pace
 */
const input = useStorage<DistanceTime>('pace-calculator-input', {
  distanceValue: 5,
  distanceUnit: DistanceUnits.Kilometers,
  time: 1200,
});

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage<string>('pace-calculator-target-set', '_pace_targets');

/**
 * The target sets
 */
const targetSets = useStorage<StandardTargetSets>('pace-calculator-target-sets', {
  _pace_targets: defaultTargetSets._pace_targets
});
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
