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
      <target-set-selector v-model="selectedTargetSet" @targets-updated="reloadTargets"
        :default-unit-system="defaultUnitSystem"/>
    </div>

    <div class="output">
      <table class="results">
        <thead>
          <tr>
            <th>
              <span>Distance</span>
              <span class="mobile-abbreviation">Dist.</span>
            </th>

            <th>Time</th>

            <th>Split</th>

            <th>Pace</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in results" :key="index">
            <td>
              {{ formatNumber(item.distanceValue, 0, 2, false) }}
              {{ distanceUnits[item.distanceUnit].symbol }}
            </td>

            <td>
              {{ formatDuration(item.totalTime, 3, 2, true) }}
            </td>

            <td v-if="targetSets[selectedTargetSet]">
              <time-input v-model="targetSets[selectedTargetSet].targets[index].split"
                label="Split duration" :showHours="false"/>
            </td>

            <td>
              {{ formatDuration(item.pace, 3, 0, true) }}
              / {{ distanceUnits[getDefaultDistanceUnit(defaultUnitSystem)].symbol }}
            </td>
          </tr>

          <tr v-if="!targetSets[selectedTargetSet] || targetSets[selectedTargetSet].targets.length === 0" class="empty-message">
            <td colspan="5">
              There aren't any targets in this set yet.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import formatUtils from '@/utils/format';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import TargetSetSelector from '@/components/TargetSetSelector.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'SplitCalculator',

  components: {
    TargetSetSelector,
    TimeInput,
  },

  data() {
    return {
      /**
       * The default unit system
       *
       * Loaded in activate() method
       */
      defaultUnitSystem: null,

      /**
       * The distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,

      /**
       * The formatDuration method
       */
      formatDuration: formatUtils.formatDuration,

      /**
       * The formatNumber method
       */
      formatNumber: formatUtils.formatNumber,

      /**
       * The getDefaultDistanceUnit method
       */
      getDefaultDistanceUnit: unitUtils.getDefaultDistanceUnit,

      /**
       * The current selected target set
       */
      selectedTargetSet: storage.get('split-calculator-target-set', '_split_targets'),

      /**
       * The default output targets
       *
       * Loaded in activate() method
       */
      targetSets: {},
    };
  },

  watch: {
    /**
     * Save default unit system
     */
    defaultUnitSystem(newValue) {
      storage.set('default-unit-system', newValue);
    },

    /**
     * Save the current selected target set
     */
    selectedTargetSet(newValue) {
      storage.set('split-calculator-target-set', newValue);
    },
  },

  computed: {
    /**
     * The target table results
     */
    results() {
      // Initialize results array
      const results = [];

      // Check for missing target set
      if (!this.targetSets[this.selectedTargetSet]) return [];

      let targets = targetUtils.sort(this.targetSets[this.selectedTargetSet].targets.filter(x =>
        x.result === 'time'));

      for (let i = 0; i < targets.length; i += 1) {
        // Calculate split and total times
        const splitTime = targets[i].split || 0;
        const totalTime = i === 0 ? splitTime : results[i - 1].totalTime + splitTime;

        // Calculate split and total distances
        const totalDistance = unitUtils.convertDistance(
          targets[i].distanceValue,
          targets[i].distanceUnit, 'meters',
        );
        const splitDistance = i === 0 ? totalDistance : totalDistance - results[i - 1].distance;

        // Calculate pace
        const pace = splitTime / unitUtils.convertDistance(splitDistance, 'meters',
          unitUtils.getDefaultDistanceUnit(this.defaultUnitSystem));

        // Add row to results array
        results.push({
          distance: totalDistance,
          distanceValue: targets[i].distanceValue,
          distanceUnit: targets[i].distanceUnit,
          totalTime,
          splitTime,
          pace,
        });
      }

      // Return results array
      return results;
    },
  },

  methods: {
    /**
     * Reload the target sets
     */
    reloadTargets() {
      this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
    },
  },

  /**
   * (Re)load settings used in multiple calculators
   */
  activated() {
    this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
    this.defaultUnitSystem = storage.get('default-unit-system', unitUtils.detectDefaultUnitSystem());
  },
};
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

/* Show/hide mobile abbreviations */
.results th:first-child span.mobile-abbreviation {
  display: none;
}
@media only screen and (max-width: 500px) {
  .results th:first-child span:not(.mobile-abbreviation) {
    display: none;
  }
  .results th:first-child span.mobile-abbreviation {
    display: inherit;
  }
}
</style>
