<template>
  <div class="pace-calculator">
    <div class="input">
      Running
      <decimal-input v-model="inputDistance" aria-label="distance value"
        :min="0" :digits="2"/>
      <select v-model="inputUnit" aria-label="distance unit">
        <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
          {{ value }}
        </option>
      </select>
      in
      <time-input v-model="inputTime"/>
    </div>

    <p>is the same pace as running</p>

    <time-table class="output" :calculate-result="calculatePace" :default-targets="defaultTargets"/>
  </div>
</template>

<script>
import paceUtils from '@/utils/paces';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import TimeTable from '@/components/TimeTable.vue';

export default {
  name: 'PaceCalculator',

  components: {
    DecimalInput,
    TimeInput,
    TimeTable,
  },

  data() {
    return {
      /**
       * The input distance value
       */
      inputDistance: 1,

      /**
       * The input distance unit
       */
      inputUnit: 'miles',

      /**
       * The input time value
       */
      inputTime: 10 * 60,

      /**
       * The names of the distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNIT_NAMES,

      /**
       * The default output targets
       */
      defaultTargets: [
        { distanceValue: 100, distanceUnit: 'meters' },
        { distanceValue: 200, distanceUnit: 'meters' },
        { distanceValue: 300, distanceUnit: 'meters' },
        { distanceValue: 400, distanceUnit: 'meters' },
        { distanceValue: 600, distanceUnit: 'meters' },
        { distanceValue: 800, distanceUnit: 'meters' },
        { distanceValue: 1000, distanceUnit: 'meters' },
        { distanceValue: 1200, distanceUnit: 'meters' },
        { distanceValue: 1500, distanceUnit: 'meters' },
        { distanceValue: 1600, distanceUnit: 'meters' },
        { distanceValue: 3200, distanceUnit: 'meters' },

        { distanceValue: 1, distanceUnit: 'miles' },
        { distanceValue: 2, distanceUnit: 'miles' },
        { distanceValue: 3, distanceUnit: 'miles' },
        { distanceValue: 5, distanceUnit: 'miles' },
        { distanceValue: 10, distanceUnit: 'miles' },

        { distanceValue: 2, distanceUnit: 'kilometers' },
        { distanceValue: 3, distanceUnit: 'kilometers' },
        { distanceValue: 4, distanceUnit: 'kilometers' },
        { distanceValue: 5, distanceUnit: 'kilometers' },
        { distanceValue: 6, distanceUnit: 'kilometers' },
        { distanceValue: 8, distanceUnit: 'kilometers' },
        { distanceValue: 10, distanceUnit: 'kilometers' },
        { distanceValue: 15, distanceUnit: 'kilometers' },

        { distanceValue: 0.5, distanceUnit: 'marathons' },
        { distanceValue: 1, distanceUnit: 'marathons' },
      ],
    };
  },

  computed: {
    /**
     * The input pace (in seconds per meter)
     */
    pace() {
      const distance = unitUtils.convertDistance(this.inputDistance,
        this.inputUnit, unitUtils.DISTANCE_UNITS.meters);
      return paceUtils.getPace(distance, this.inputTime);
    },
  },

  methods: {
    /**
     * Calculate paces from a target
     * @param {Object} target The target
     * @returns {Object} The result
     */
    calculatePace(target) {
      // Convert distance into meters
      const distance = unitUtils.convertDistance(target.distanceValue, target.distanceUnit,
        unitUtils.DISTANCE_UNITS.meters);

      // Calculate time to travel distance at input pace
      const time = paceUtils.getTime(this.pace, distance);

      // Return result
      return {
        distanceValue: target.distanceValue,
        distanceUnit: target.distanceUnit,
        time,
      };
    },
  },
};
</script>

<style scoped>
/* container */
.pace-calculator {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* calculator input */
.input {
  text-align: center;
  margin-bottom: 5px;
}
.input>* {
  margin-bottom: 5px;  /* adds space between wrapped lines */
}
.input select {
  margin-left: 5px;
}

/* calculator output */
.output {
  margin-top: 10px;
}
@media only screen and (max-width: 500px) {
  .output {
    width: 100%;
    min-width: 0px;
  }
}
</style>
