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

    <table class="output" v-if="!inEditMode">
      <thead>
        <tr>
          <th colspan="2">Distance</th>
          <th>Time</th>
          <th>
            <button class="icon" title="Edit Targets" @click="inEditMode=true">
              <img alt="" src="@/assets/edit.svg">
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in results" :key="index">
          <td>
            {{ item.distanceValue.toFixed(2) }}
            {{ distanceSymbols[item.distanceUnit] }}
          </td>

          <td>in</td>

          <td colspan="2">
            {{ formatDuration(item.time, 0, 2) }}
          </td>
        </tr>

        <tr v-if="results.length === 0" class="empty-message">
          <td colspan="4">
            There aren't any targets,<br>
            click
            <img alt="Edit Targets" src="@/assets/edit.svg">
            to add one
          </td>
        </tr>
      </tbody>
    </table>

    <table class="edit-targets" v-if="inEditMode">
      <thead>
        <tr>
          <th>
            Edit Targets
          </th>
          <th>
            <button class="icon" title="Close" @click="inEditMode=false">
              <img alt="" src="@/assets/x.svg">
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in targets" :key="index">
          <td>
            <decimal-input v-model="item.distanceValue" aria-label="Distance Value"
              :min="0" :digits="2"/>
            <select v-model="item.distanceUnit" aria-label="Distance Unit">
              <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
                {{ value }}
              </option>
            </select>
          </td>

          <td>
            <button class="icon" title="Remove Target" @click="targets.splice(index, 1)">
              <img alt="" src="@/assets/trash-2.svg">
            </button>
          </td>
        </tr>

        <tr v-if="targets.length === 0" class="empty-message">
          <td colspan="4">
            There aren't any targets,<br>
            click
            <img alt="Add Target" src="@/assets/plus-circle.svg">
            to add one
          </td>
        </tr>

        <tr class="add-target">
          <td colspan="4">
            <button class="icon" title="Add Target" @click="targets.push({distanceValue: 1,
            distanceUnit: 'miles'})">
              <img alt="" src="@/assets/plus-circle.svg">
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import paceUtils from '@/utils/paces';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'PaceCalculator',

  components: {
    DecimalInput,
    TimeInput,
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
       * The symbols of the distance units
       */
      distanceSymbols: unitUtils.DISTANCE_UNIT_SYMBOLS,

      /**
       * The formatDuration method
       */
      formatDuration: unitUtils.formatDuration,

      /**
       * Whether the calculator is in edit targets mode
       */
      inEditMode: false,

      /**
       * The output targets
       */
      targets: [
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

    /**
     * The output results
     */
    results() {
      // Calculate results
      const result = [];
      this.targets.forEach((row) => {
        // Convert distance into meters
        const distance = unitUtils.convertDistance(row.distanceValue,
          row.distanceUnit, unitUtils.DISTANCE_UNITS.meters);

        // Calculate time to travel distance at input pace
        const time = paceUtils.getTime(this.pace, distance);

        // Add result
        result.push({
          distanceValue: row.distanceValue,
          distanceUnit: row.distanceUnit,
          time,
        });
      });

      // Sort results by time
      result.sort((a, b) => a.time - b.time);

      // Return results
      return result;
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
.output th:last-child {
  text-align: right;
}

/* edit targets table */
.edit-targets th:last-child, .edit-targets td:last-child {
  text-align: right;
}
.edit-targets td select {
  margin-left: 0.2em;
}
.edit-targets .add-target td {
  text-align: center;
  padding: 0.5em 0.2em;
}

/* general table styles */
table {
  margin-top: 10px;
  border-collapse: collapse;
  min-width: 300px;
  text-align: left;
}
table tr {
  border: 0.1em solid #000000;
}
table th, table td {
  padding: 0.2em;
}
table button.icon {
  height: 2em;
  width: 2em;
}
@media only screen and (max-width: 500px) {
  table {
    width: 100%;
    min-width: 0px;
  }
}

/* empty table message */
.empty-message td {
  text-align: center !important;
}
.empty-message img {
  height: 1em;
  width: 1em;
}
</style>
