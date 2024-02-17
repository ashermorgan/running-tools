<template>
  <div class="calculator">
    <h2>Input Race Result</h2>
    <div class="input">
      <div>
        Distance:
        <decimal-input v-model="inputDistance" aria-label="Input distance value" :min="0" :digits="2"/>
        <select v-model="inputUnit" aria-label="Input distance unit">
          <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
            {{ value.name }}
          </option>
        </select>
      </div>
      <div>
        Time:
        <time-input v-model="inputTime" label="Input race duration"/>
      </div>
    </div>

    <h2>
      Advanced
      <button class="link" @click="showAdvancedOptions=!showAdvancedOptions">
        {{ showAdvancedOptions ? '[hide]' : '[show]' }}
      </button>
    </h2>
    <div class="advanced-options" v-show="showAdvancedOptions">
      <div class="default-units">
        Default units:
        <select v-model="defaultUnitSystem" aria-label="Default units">
          <option value="imperial">Miles</option>
          <option value="metric">Kilometers</option>
        </select>
      </div>
      <div>
        Prediction Model:
        <select v-model="model" aria-label="Prediction model">
          <option value="AverageModel">Average</option>
          <option value="PurdyPointsModel">Purdy Points Model</option>
          <option value="VO2MaxModel">V&#775;O&#8322; Max Model</option>
          <option value="CameronModel">Cameron's Model</option>
          <option value="RiegelModel">Riegel's Model</option>
        </select>
      </div>
      <div>
        Riegel Exponent:
        <decimal-input v-model="riegelExponent" aria-label="Riegel exponent" :min="1" :max="1.3"
          :digits="2" :step="0.01"/>
        (default: 1.06)
      </div>
      <div>
        Purdy Points: <b>{{ formatNumber(purdyPoints, 0, 1, true) }}</b>
      </div>
      <div>
        V&#775;O&#8322;: <b>{{ formatNumber(vo2, 0, 1, true) }}</b> ml/kg/min
          (<b>{{ formatNumber(vo2Percentage, 0, 1, true) }}%</b> of max)
      </div>
      <div>
        V&#775;O&#8322; Max: <b>{{ formatNumber(vo2Max, 0, 1, true) }}</b> ml/kg/min
      </div>
    </div>

    <h2>Equivalent Race Results</h2>
    <div class="target-set">
      Target Set:
      <target-set-selector v-model="selectedTargetSet" @targets-updated="reloadTargets"
        :default-unit-system="defaultUnitSystem"/>
    </div>

    <simple-target-table class="output" :calculate-result="predictResult" :default-unit-system="defaultUnitSystem"
     :targets="targetSets[selectedTargetSet] ? targetSets[selectedTargetSet].targets : []" show-pace/>
  </div>
</template>

<script>
import formatUtils from '@/utils/format';
import raceUtils from '@/utils/races';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';
import TargetSetSelector from '@/components/TargetSetSelector.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'RaceCalculator',

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
      inputDistance: storage.get('race-calculator-input-distance', 5),

      /**
       * The input distance unit
       */
      inputUnit: storage.get('race-calculator-input-unit', 'kilometers'),

      /**
       * The input time value
       */
      inputTime: storage.get('race-calculator-input-time', 20 * 60),

      /**
       * The default unit system
       *
       * Loaded in activate() method
       */
      defaultUnitSystem: null,

      /**
      * The race prediction model
      */
      model: storage.get('race-calculator-model', 'AverageModel'),

      /**
      * The value of the exponent in Riegel's Model
      */
      riegelExponent: storage.get('race-calculator-riegel-exponent', 1.06),

      /**
      * Whether to show the advanced options
      */
      showAdvancedOptions: storage.get('race-calculator-show-advanced-options', false),

      /**
       * The names of the distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,

      /**
       * The formatNumber method
       */
      formatNumber: formatUtils.formatNumber,

      /**
       * The current selected target set
       */
      selectedTargetSet: storage.get('race-calculator-target-set', '_race_targets'),

      /**
       * The target sets
       *
       * Loaded in activate() method
       */
      targetSets: {},
    };
  },

  methods: {
    /**
     * Reload the target sets
     */
    reloadTargets() {
      this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
    },

    /**
     * Predict race results from a target
     * @param {Object} target The target
     * @returns {Object} The result
     */
    predictResult(target) {
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

        // Get prediction
        let time;
        switch (this.model) {
          default:
          case 'AverageModel':
            time = raceUtils.AverageModel.predictTime(this.d1, this.inputTime, d2,
              this.riegelExponent);
            break;
          case 'PurdyPointsModel':
            time = raceUtils.PurdyPointsModel.predictTime(this.d1, this.inputTime, d2);
            break;
          case 'VO2MaxModel':
            time = raceUtils.VO2MaxModel.predictTime(this.d1, this.inputTime, d2);
            break;
          case 'RiegelModel':
            time = raceUtils.RiegelModel.predictTime(this.d1, this.inputTime, d2,
              this.riegelExponent);
            break;
          case 'CameronModel':
            time = raceUtils.CameronModel.predictTime(this.d1, this.inputTime, d2);
            break;
        }

        // Update result
        result.time = time;
      } else {
        // Get prediction
        let distance;
        switch (this.model) {
          default:
          case 'AverageModel':
            distance = raceUtils.AverageModel.predictDistance(this.inputTime, this.d1, target.time,
              this.riegelExponent);
            break;
          case 'PurdyPointsModel':
            distance = raceUtils.PurdyPointsModel.predictDistance(this.inputTime, this.d1,
              target.time);
            break;
          case 'VO2MaxModel':
            distance = raceUtils.VO2MaxModel.predictDistance(this.inputTime, this.d1, target.time);
            break;
          case 'RiegelModel':
            distance = raceUtils.RiegelModel.predictDistance(this.inputTime, this.d1, target.time,
              this.riegelExponent);
            break;
          case 'CameronModel':
            distance = raceUtils.CameronModel.predictDistance(this.inputTime, this.d1, target.time);
            break;
        }

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

  computed: {
    /**
     * The input distance in meters
     */
    d1() {
      return unitUtils.convertDistance(this.inputDistance, this.inputUnit, 'meters');
    },

    /**
     * The Purdy Points for the input race
     */
    purdyPoints() {
      const result = raceUtils.PurdyPointsModel.getPurdyPoints(this.d1, this.inputTime);
      return result;
    },

    /**
     * The VO2 Max calculated from the input race
     */
    vo2Max() {
      const result = raceUtils.VO2MaxModel.getVO2Max(this.d1, this.inputTime);
      return result;
    },

    /**
     * The VO2 calculated from the input race
     */
    vo2() {
      const result = raceUtils.VO2MaxModel.getVO2(this.d1, this.inputTime);
      return result;
    },

    /**
     * The percentage of VO2 Max calculated from the input race
     */
    vo2Percentage() {
      const result = raceUtils.VO2MaxModel.getVO2Percentage(this.inputTime) * 100;
      return result;
    },
  },

  watch: {
    /**
     * Save input distance value
     */
    inputDistance(newValue) {
      storage.set('race-calculator-input-distance', newValue);
    },

    /**
     * Save input distance unit
     */
    inputUnit(newValue) {
      storage.set('race-calculator-input-unit', newValue);
    },

    /**
     * Save input time value
     */
    inputTime(newValue) {
      storage.set('race-calculator-input-time', newValue);
    },

    /**
     * Save default unit system
     */
    defaultUnitSystem(newValue) {
      storage.set('default-unit-system', newValue);
    },

    /**
     * Save prediction model
     */
    model(newValue) {
      storage.set('race-calculator-model', newValue);
    },

    /**
     * Save Riegel Model exponent
     */
    riegelExponent(newValue) {
      storage.set('race-calculator-riegel-exponent', newValue);
    },

    /**
     * Save advanced options state
     */
    showAdvancedOptions(newValue) {
      storage.set('race-calculator-show-advanced-options', newValue);
    },

    /**
     * Save the current selected target set
     */
    selectedTargetSet(newValue) {
      storage.set('race-calculator-target-set', newValue);
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

/* advanced options */
.advanced-options>* {
  margin-bottom: 5px;
}
</style>
