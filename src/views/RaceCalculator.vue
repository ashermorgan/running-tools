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
      <race-options-input v-model="options"/>
    </details>

    <h2>Equivalent Race Results</h2>
    <single-output-table class="output" show-pace
      :calculate-result="x => calculateRaceResults(input, x, options, defaultUnitSystem, true)"
      :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { calculateRaceResults, calculateRaceStats } from '@/utils/calculators';
import type { RaceOptions } from '@/utils/calculators';
import { formatNumber } from '@/utils/format';
import { RacePredictionModel } from '@/utils/races';
import { defaultTargetSets } from '@/utils/targets';
import type { StandardTargetSets } from '@/utils/targets';
import { DistanceUnits, UnitSystems, detectDefaultUnitSystem } from '@/utils/units';
import type { DistanceTime } from '@/utils/units';

import PaceInput from '@/components/PaceInput.vue';
import RaceOptionsInput from '@/components/RaceOptionsInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';

import useStorage from '@/composables/useStorage';

/**
 * The input race
 */
const input = useStorage<DistanceTime>('race-calculator-input', {
  distanceValue: 5,
  distanceUnit: DistanceUnits.Kilometers,
  time: 1200,
});

/**
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

/**
* The race prediction options
*/
const options = useStorage<RaceOptions>('race-calculator-options', {
  model: RacePredictionModel.AverageModel,
  riegelExponent: 1.06,
});

/**
 * The current selected target set
 */
const selectedTargetSet = useStorage<string>('race-calculator-target-set', '_race_targets');

/**
 * The target sets
 */
const targetSets = useStorage<StandardTargetSets>('race-calculator-target-sets', {
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
