<template>
  <div class="calculator">
    <h2>Input Race Result</h2>
    <div class="input">
      <pace-input v-model="input" label="Input race"/>
    </div>

    <details>
      <summary>
        <h2>Race Statistics</h2>
      </summary>
      <div>
        Purdy Points: <b>{{ formatNumber(raceStats.purdyPoints, 0, 1, true) }}</b>
      </div>
      <div>
        V&#775;O&#8322;: <b>{{ formatNumber(raceStats.vo2, 0, 1, true) }}</b> ml/kg/min
          (<b>{{ formatNumber(raceStats.vo2MaxPercentage, 0, 1, true) }}%</b> of max)
      </div>
      <div>
        V&#775;O&#8322; Max: <b>{{ formatNumber(raceStats.vo2Max, 0, 1, true) }}</b>
          ml/kg/min
      </div>
    </details>

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
      <race-options v-model="options"/>
    </details>

    <h2>Equivalent Race Results</h2>
    <single-output-table class="output" show-pace
      :calculate-result="x => calculateRaceResults(input, x, options, defaultUnitSystem)"
      :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { calculateRaceResults, calculateRaceStats } from '@/utils/calculators';
import { formatNumber } from '@/utils/format';
import { defaultTargetSets } from '@/utils/targets';
import { detectDefaultUnitSystem } from '@/utils/units';

import PaceInput from '@/components/PaceInput.vue';
import RaceOptions from '@/components/RaceOptions.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/**
 * The input race
 */
const input = useStorage('race-calculator-input', {
  distanceValue: 5,
  distanceUnit: 'kilometers',
  time: 1200,
});

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage('default-unit-system', detectDefaultUnitSystem());

/**
* The race prediction options
*/
const options = useStorage('race-calculator-options', {
  model: 'AverageModel',
  riegelExponent: 1.06,
});

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage('race-calculator-target-set', '_race_targets');

/**
 * The target sets
 */
let targetSets = useStorage('race-calculator-target-sets', {
  _race_targets: defaultTargetSets._race_targets
});

/**
 * The statistics for the current input race
 */
const raceStats = computed(() => calculateRaceStats(input.value));
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
