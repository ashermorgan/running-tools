<template>
  <div class="calculator">
    <h2>Input Pace</h2>
    <div class="input">
      <div>
        Distance:
        <decimal-input v-model="inputDistance" aria-label="Input distance value"
          :min="0" :digits="2"/>
        <select v-model="inputUnit" aria-label="Input distance unit">
          <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
            {{ value.name }}
          </option>
        </select>
      </div>
      <div>
        Time:
        <time-input v-model="inputTime" label="Input duration"/>
      </div>
    </div>

    <h2>Equivalent Paces</h2>
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

    <simple-target-table class="output" :calculate-result="calculatePace"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []"/>
  </div>
</template>

<script>
import paceUtils from '@/utils/paces';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'PaceCalculator',

  components: {
    DecimalInput,
    SimpleTargetTable,
    TargetSetSelector,
    TimeInput,
  },

  data() {
    return {
      /**
       * The input distance value
       */
      inputDistance: storage.get('pace-calculator-input-distance', 5),

      /**
       * The input distance unit
       */
      inputUnit: storage.get('pace-calculator-input-unit', 'kilometers'),

      /**
       * The input time value
       */
      inputTime: storage.get('pace-calculator-input-time', 20 * 60),

      /**
       * The default unit system
       *
       * Loaded in activate() method
       */
      defaultUnitSystem: null,

      /**
       * The names of the distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,

      /**
       * The current selected target set
       */
      selectedTargetSet: storage.get('pace-calculator-target-set', '_pace_targets'),

      /**
       * The target sets
       *
       * Loaded in activate() method
       */
      targetSets: {},
    };
  },

  watch: {
    /**
     * Save input distance value
     */
    inputDistance(newValue) {
      storage.set('pace-calculator-input-distance', newValue);
    },

    /**
     * Save input distance unit
     */
    inputUnit(newValue) {
      storage.set('pace-calculator-input-unit', newValue);
    },

    /**
     * Save input time value
     */
    inputTime(newValue) {
      storage.set('pace-calculator-input-time', newValue);
    },

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
      storage.set('pace-calculator-target-set', newValue);
    },
  },

  computed: {
    /**
     * The input pace (in seconds per meter)
     */
    pace() {
      const distance = unitUtils.convertDistance(this.inputDistance, this.inputUnit, 'meters');
      return paceUtils.getPace(distance, this.inputTime);
    },
  },

  methods: {
    /**
     * Reload the target sets
     */
    reloadTargets() {
      this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
    },

    /**
     * Calculate paces from a target
     * @param {Object} target The target
     * @returns {Object} The result
     */
    calculatePace(target) {
      // Initialize result
      const result = {
        distanceValue: target.distanceValue,
        distanceUnit: target.distanceUnit,
        time: target.time,
        result: target.result,
      };

      // Add missing value to result
      if (target.result === 'time') {
        // Convert target distance into meters
        const d2 = unitUtils.convertDistance(target.distanceValue, target.distanceUnit, 'meters');

        // Calculate time to travel distance at input pace
        const time = paceUtils.getTime(this.pace, d2);

        // Update result
        result.time = time;
      } else {
        // Calculate distance traveled in time at input pace
        let distance = paceUtils.getDistance(this.pace, target.time);

        // Convert output distance into default distance unit
        distance = unitUtils.convertDistance(distance, 'meters',
          unitUtils.getDefaultDistanceUnit(this.defaultUnitSystem));

        // Update result
        result.distanceValue = distance;
        result.distanceUnit = unitUtils.getDefaultDistanceUnit(this.defaultUnitSystem);
      }

      // Return result
      return result;
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
</style>
