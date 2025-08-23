<template>
  <div class="calculator">
    <h2>Input Race Result</h2>
    <div class="input">
      <pace-input v-model="raceOptions.input" label="Input race"/>
    </div>

    <details>
      <summary>
        <h2>Race Statistics</h2>
      </summary>
      <div>
        Purdy points: <b>{{ formatNumber(raceStats.purdyPoints, 0, 1, true) }}</b>
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
      <advanced-options-input v-model:globalOptions="globalOptions"
        v-model:options="raceOptions" v-model:targetSets="targetSets" :type="Calculators.Race"/>
    </details>

    <h2>Equivalent Race Results</h2>
    <single-output-table class="output" show-pace :calculate-result="x =>
      calculateRaceResults(raceOptions.input, x, globalOptions.racePredictionOptions,
      globalOptions.defaultUnitSystem, true)"
      :targets="targetSets[raceOptions.selectedTargetSet] ?
      targetSets[raceOptions.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Calculators, calculateRaceResults, calculateRaceStats, defaultGlobalOptions,
  defaultRaceOptions } from '@/core/calculators';
import type { GlobalOptions, RaceOptions, RaceStats } from '@/core/calculators';
import { defaultRaceTargetSets } from '@/core/targets';
import type { StandardTargetSets } from '@/core/targets';
import { formatNumber } from '@/core/units';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';

import useStorage from '@/composables/useStorage';

/*
 * The global options
 */
const globalOptions = useStorage<GlobalOptions>('global-options', defaultGlobalOptions);

/*
* The race calculator options
*/
const raceOptions = useStorage<RaceOptions>('race-calculator-options', defaultRaceOptions);

/*
 * The race calculator target sets
 */
const targetSets = useStorage<StandardTargetSets>('race-calculator-target-sets',
  defaultRaceTargetSets);

/*
 * The statistics for the current input race
 */
const raceStats = computed<RaceStats>(() => calculateRaceStats(raceOptions.value.input));
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
