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

    <table class="output">
      <thead>
        <tr>
          <th>Distance</th>
          <th></th>
          <th>Time</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in results" :key="index">
          <td>
            {{ item.distanceValue.toFixed(2) }}
            {{ distanceSymbols[item.distanceUnit] }}
          </td>

          <td>in</td>

          <td>
            {{ formatDuration(item.time, 0, 2) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import paceUtils from '@/utils/paces.js';
import unitUtils from '@/utils/units.js';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'PaceCalculator',

  components: {
    DecimalInput,
    TimeInput,
  },

  data: function() {
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
       * The symbols of the distance units
       */
      distanceSymbols: unitUtils.DISTANCE_UNIT_SYMBOLS,

      /**
       * The formatDuration method
       */
      formatDuration: unitUtils.formatDuration,

      /**
       * The output targets
       */
      targets: [
        { distanceValue: 100,   distanceUnit: 'meters' },
        { distanceValue: 200,   distanceUnit: 'meters' },
        { distanceValue: 300,   distanceUnit: 'meters' },
        { distanceValue: 400,   distanceUnit: 'meters' },
        { distanceValue: 600,   distanceUnit: 'meters' },
        { distanceValue: 800,   distanceUnit: 'meters' },
        { distanceValue: 1000,  distanceUnit: 'meters' },
        { distanceValue: 1200,  distanceUnit: 'meters' },
        { distanceValue: 1500,  distanceUnit: 'meters' },
        { distanceValue: 1600,  distanceUnit: 'meters' },
        { distanceValue: 3200,  distanceUnit: 'meters' },

        { distanceValue: 1,     distanceUnit: 'miles' },
        { distanceValue: 2,     distanceUnit: 'miles' },
        { distanceValue: 3,     distanceUnit: 'miles' },
        { distanceValue: 5,     distanceUnit: 'miles' },
        { distanceValue: 10,    distanceUnit: 'miles' },

        { distanceValue: 2,     distanceUnit: 'kilometers' },
        { distanceValue: 3,     distanceUnit: 'kilometers' },
        { distanceValue: 4,     distanceUnit: 'kilometers' },
        { distanceValue: 5,     distanceUnit: 'kilometers' },
        { distanceValue: 6,     distanceUnit: 'kilometers' },
        { distanceValue: 8,     distanceUnit: 'kilometers' },
        { distanceValue: 10,    distanceUnit: 'kilometers' },
        { distanceValue: 15,    distanceUnit: 'kilometers' },

        { distanceValue: 0.5,   distanceUnit: 'marathons' },
        { distanceValue: 1,     distanceUnit: 'marathons' },
      ],
    };
  },

  computed: {
    /**
     * The input pace (in seconds per meter)
     */
    pace: function() {
      let distance = unitUtils.convertDistance(this.inputDistance,
        this.inputUnit, unitUtils.DISTANCE_UNITS.meters);
      return paceUtils.getPace(distance, this.inputTime);
    },

    /**
     * The output results
     */
    results: function() {
      // Calculate results
      let result = [];
      for (let row of this.targets) {
        // Convert distance into meters
        let distance = unitUtils.convertDistance(row.distanceValue,
          row.distanceUnit, unitUtils.DISTANCE_UNITS.meters);

        // Calculate time to travel distance at input pace
        let time = paceUtils.getTime(this.pace, distance);

        // Add result
        result.push({
          distanceValue: row.distanceValue,
          distanceUnit: row.distanceUnit,
          time: time,
        });
      }

      // Sort results by time
      result.sort(function(a, b){return a.time-b.time});

      // Return results
      return result;
    },
  },
}
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
table {
  margin-top: 10px;
  border-collapse: collapse;
  min-width: 300px;
}
tr {
  border: 0.1em solid #000000;
}
th, td {
  padding: 0.2em;
  text-align: left;
}
@media only screen and (max-width: 400px) {
  table {
    width: 100%;
    min-width: 0px;
  }
}
</style>
