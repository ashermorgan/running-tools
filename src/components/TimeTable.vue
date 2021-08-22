<template>
  <div class="time-table">
    <table class="results" v-show="!inEditMode">
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

    <table class="targets" v-show="inEditMode">
      <thead>
        <tr>
          <th>Edit Targets</th>

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
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';

export default {
  name: 'TimeTable',

  components: {
    DecimalInput,
  },

  props: {
    /**
     * The method that generates the time table rows
     */
    calculateResult: {
      type: Function,
      required: true,
    },

    /**
     * The default time table targets
     */
    defaultTargets: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
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
       * Whether the table is in edit mode
       */
      inEditMode: false,

      /**
       * The time table targets
       */
      targets: this.defaultTargets,
    };
  },

  computed: {
    /**
     * The time table results
     */
    results() {
      // Calculate results
      const result = [];
      this.targets.forEach((row) => {
        // Add result
        result.push(this.calculateResult(row));
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
/* time table */
.results th:last-child {
  text-align: right;
}

/* edit targets table */
.targets th:last-child, .targets td:last-child {
  text-align: right;
}
.targets td select {
  margin-left: 0.2em;
}
.targets .add-target td {
  text-align: center;
  padding: 0.5em 0.2em;
}

/* general table styles */
table {
  border-collapse: collapse;
  min-width: 300px;
  width: 100%;
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

/* empty table message */
.empty-message td {
  text-align: center !important;
}
.empty-message img {
  height: 1em;
  width: 1em;
}
</style>
