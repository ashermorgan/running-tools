<template>
  <div class="race-calculator">
    <h2>Input Race Result</h2>
    <div class="input">
      <div>
        Distance:
        <decimal-input v-model="inputDistance" aria-label="Distance value" :min="0" :digits="2"/>
        <select v-model="inputUnit" aria-label="Distance unit">
          <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
            {{ value.name }}
          </option>
        </select>
      </div>
      <div>
        Time:
        <time-input v-model="inputTime"/>
      </div>
    </div>

    <h2>
      Advanced
      <button class="link" @click="showAdvancedOptions=!showAdvancedOptions">
        {{ showAdvancedOptions ? '[hide]' : '[show]' }}
      </button>
    </h2>
    <div class="advanced-options" v-show="showAdvancedOptions">
      <div>
        Prediction Model:
        <select v-model="model" aria-label="Prediction Model">
          <option value="AverageModel">Average</option>
          <option value="PurdyPointsModel">Purdy Points Model</option>
          <option value="VO2MaxModel">V&#775;O&#8322; Max Model</option>
          <option value="CameronModel">Cameron's Model</option>
          <option value="RiegelModel">Riegel's Model</option>
        </select>
      </div>
      <div>
        Riegel Exponent:
        <decimal-input v-model="riegelExponent" aria-label="Riegel Exponent" :min="1" :max="1.3"
          :digits="2" :step="0.01"/>
        (default: 1.06)
      </div>
      <div>
        Purdy Points: <b>{{ purdyPoints.toFixed(1) }}</b>
      </div>
      <div>
        V&#775;O&#8322;: <b>{{ vo2.toFixed(1) }}</b> ml/kg/min
          (<b>{{ vo2Percentage.toFixed(1) }}%</b> of max)
      </div>
      <div>
        V&#775;O&#8322; Max: <b>{{ vo2Max.toFixed(1) }}</b> ml/kg/min
      </div>
    </div>

    <h2>Equivalent Race Results</h2>

    <simple-target-table class="output" :calculate-result="predictResult"
      :default-targets="defaultTargets" storage-key="race-calculator-targets-v2" show-pace/>
  </div>
</template>

<script>
import raceUtils from '@/utils/races';
import storage from '@/utils/localStorage';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import SimpleTargetTable from '@/components/SimpleTargetTable.vue';

export default {
  name: 'RaceCalculator',

  components: {
    DecimalInput,
    TimeInput,
    SimpleTargetTable,
  },

  data() {
    return {
      /**
       * The input distance value
       */
      inputDistance: 5,

      /**
       * The input distance unit
       */
      inputUnit: 'kilometers',

      /**
       * The input time value
       */
      inputTime: 20 * 60,

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
       * The default output targets
       */
      defaultTargets: [
        { result: 'time', distanceValue: 400, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 800, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1000, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1200, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1500, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 1600, distanceUnit: 'meters' },
        { result: 'time', distanceValue: 3200, distanceUnit: 'meters' },

        { result: 'time', distanceValue: 3, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 5, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 8, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 10, distanceUnit: 'kilometers' },
        { result: 'time', distanceValue: 15, distanceUnit: 'kilometers' },

        { result: 'time', distanceValue: 1, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 2, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 3, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 5, distanceUnit: 'miles' },
        { result: 'time', distanceValue: 10, distanceUnit: 'miles' },

        { result: 'time', distanceValue: 0.5, distanceUnit: 'marathons' },
        { result: 'time', distanceValue: 1, distanceUnit: 'marathons' },

        { result: 'distance', time: 600 },
        { result: 'distance', time: 3600 },
      ],
    };
  },

  methods: {
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
        distance = unitUtils.convertDistance(distance, 'meters', unitUtils.getDefaultDistanceUnit());

        // Update result
        result.distanceValue = distance;
        result.distanceUnit = unitUtils.getDefaultDistanceUnit();
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
  },
};
</script>

<style scoped>
/* container */
.race-calculator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* headings */
h2 {
  font-size: 1.3em;
  margin-bottom: 0.2em;
}
* + h2 {
  margin-top: 0.5em;
}

/* calculator input */
.input>* {
  margin-bottom: 5px;  /* adds space between wrapped lines */
}
.input select {
  margin-left: 5px;
}

/* advanced options */
.advanced-options>* {
  margin-bottom: 5px;
}

/* calculator output */
.output {
  min-width: 300px;
}
@media only screen and (max-width: 500px) {
  .output {
    width: 100%;
    min-width: 0px;
  }
}
</style>
