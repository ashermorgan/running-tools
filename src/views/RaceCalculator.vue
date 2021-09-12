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

    <h2>Equivalent Race Results</h2>

    <target-table class="output" :calculate-result="predictTime" :default-targets="defaultTargets"
      storage-key="race-calculator-targets" show-pace/>
  </div>
</template>

<script>
import raceUtils from '@/utils/races';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import TargetTable from '@/components/TargetTable.vue';

export default {
  name: 'RaceCalculator',

  components: {
    DecimalInput,
    TimeInput,
    TargetTable,
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

        { result: 'distance', distanceUnit: 'miles', time: 600 },
        { result: 'distance', distanceUnit: 'miles', time: 3600 },
      ],
    };
  },

  methods: {
    /**
     * Predict race times from a target
     * @param {Object} target The target
     * @returns {Object} The result
     */
    predictTime(target) {
      // Convert input race distance into meters
      const d1 = unitUtils.convertDistance(this.inputDistance, this.inputUnit, 'meters');

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
        const time = raceUtils.AverageModel.predictTime(d1, this.inputTime, d2);

        // Update result
        result.time = time;
      } else {
        // Get prediction
        let distance = raceUtils.AverageModel.predictDistance(this.inputTime, d1, target.time);

        // Convert output distance into miles
        distance = unitUtils.convertDistance(distance, 'meters', 'miles');

        // Update result
        result.distanceValue = distance;
        result.distanceUnit = 'miles';
      }

      // Return result
      return result;
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
