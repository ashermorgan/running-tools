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
      <advanced-options-input v-model:defaultUnitSystem="defaultUnitSystem"
        v-model:options="options" v-model:targetSets="targetSets" :type="Calculators.Race"/>
    </details>

    <h2>Equivalent Race Results</h2>
    <single-output-table class="output" show-pace
      :calculate-result="x => calculateRaceResults(input, x, options, defaultUnitSystem, true)"
      :targets="targetSets[options.selectedTargetSet] ?
      targetSets[options.selectedTargetSet].targets : []"/>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Calculators, calculateRaceResults, calculateRaceStats, defaultInput,
  defaultRaceOptions } from '@/core/calculators';
import type { RaceOptions, RaceStats } from '@/core/calculators';
import { defaultRaceTargetSets } from '@/core/targets';
import type { StandardTargetSets } from '@/core/targets';
import { UnitSystems, detectDefaultUnitSystem, formatNumber } from '@/core/units';
import type { DistanceTime } from '@/core/units';

import AdvancedOptionsInput from '@/components/AdvancedOptionsInput.vue';
import PaceInput from '@/components/PaceInput.vue';
import SingleOutputTable from '@/components/SingleOutputTable.vue';

import useStorage from '@/composables/useStorage';

/*
 * The input race
 */
const input = useStorage<DistanceTime>('race-calculator-input', defaultInput);

/*
 * The default unit system
 */
const defaultUnitSystem = useStorage<UnitSystems>('default-unit-system', detectDefaultUnitSystem());

/*
* The race calculator options
*/
const options = useStorage<RaceOptions>('race-calculator-options', defaultRaceOptions);

/*
 * The target sets
 */
const targetSets = useStorage<StandardTargetSets>('race-calculator-target-sets',
  defaultRaceTargetSets);

/*
 * The statistics for the current input race
 */
const raceStats = computed<RaceStats>(() => calculateRaceStats(input.value));
</script>

<style scoped>
@import '@/assets/target-calculator.css';
</style>
