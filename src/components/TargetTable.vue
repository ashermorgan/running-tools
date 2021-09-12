<template>
  <div class="time-table">
    <table class="results" v-show="!inEditMode">
      <thead>
        <tr>
          <th>Distance</th>

          <th>Time</th>

          <th v-if="showPace">Pace</th>

          <th>
            <button class="icon" title="Edit Targets" @click="inEditMode=true" v-blur>
              <edit-icon/>
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in results" :key="index">
          <td :class="item.result === 'distance' ? 'result' : ''">
            {{ item.distanceValue.toFixed(2) }}
            {{ distanceUnits[item.distanceUnit].symbol }}
          </td>

          <td :colspan="showPace ? 1 : 2" :class="item.result === 'time' ? 'result' : ''">
            {{ formatDuration(item.time, 0, 2) }}
          </td>

          <td v-if="showPace" colspan="2">
            {{ formatDuration(getPace(item), 0, 0) }}
            / mi
          </td>
        </tr>

        <tr v-if="results.length === 0" class="empty-message">
          <td colspan="4">
            There aren't any targets yet,<br>
            click
            <edit-icon/>
            to edit the list of targets
          </td>
        </tr>
      </tbody>
    </table>

    <table class="targets" v-show="inEditMode">
      <thead>
        <tr>
          <th>Edit Targets</th>

          <th>
            <button class="icon" title="Reset Targets" @click="resetTargets" v-blur>
              <rotate-ccw-icon/>
            </button>
            <button class="icon" title="Close" @click="inEditMode=false" v-blur>
              <x-icon/>
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, index) in targets" :key="index">
          <td v-if="item.result === 'time'">
            <decimal-input v-model="item.distanceValue" aria-label="Distance Value"
              :min="0" :digits="2"/>
            <select v-model="item.distanceUnit" aria-label="Distance Unit">
              <option v-for="(value, key) in distanceUnits" :key="key" :value="key">
                {{ value.name }}
              </option>
            </select>
          </td>

          <td v-else>
            <time-input v-model="item.time" aria-label="Time"/>
          </td>

          <td>
            <button class="icon" title="Remove Target" @click="targets.splice(index, 1)" v-blur>
              <trash-2-icon/>
            </button>
          </td>
        </tr>

        <tr v-if="targets.length === 0" class="empty-message">
          <td colspan="2">
            There aren't any targets yet
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="2">
            <button title="Add Distance Target" @click="targets.push({ result: 'time',
              distanceValue: 1, distanceUnit: 'miles' })" v-blur>
              Add distance target
            </button>
            <button title="Add Time Target" @click="targets.push({ result: 'distance',
              time: 600 })" v-blur>
              Add time target
            </button>
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import {
  EditIcon,
  RotateCcwIcon,
  Trash2Icon,
  XIcon,
} from 'vue-feather-icons';

import unitUtils from '@/utils/units';
import storage from '@/utils/localStorage';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

import blur from '@/directives/blur';

export default {
  name: 'TimeTable',

  components: {
    DecimalInput,
    TimeInput,

    EditIcon,
    RotateCcwIcon,
    Trash2Icon,
    XIcon,
  },

  directives: {
    blur,
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

    /**
     * The localStorage key for the list of targets
     */
    storageKey: {
      type: String,
      default: null,
    },

    /**
     * Whether to show result paces
     */
    showPace: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      /**
       * The distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,

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
      targets: storage.get(this.storageKey, this.defaultTargets),
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

  watch: {
    /**
     * Sort targets
     */
    inEditMode() {
      this.sortTargets();
    },

    /**
     * Save targets
     */
    targets: {
      handler(newValue) {
        if (this.storageKey !== null) {
          storage.set(this.storageKey, newValue);
        }
      },
      deep: true,
    },
  },

  methods: {
    /**
     * Restore the default targets
     */
    resetTargets() {
      // Clone default targets array
      this.targets = JSON.parse(JSON.stringify(this.defaultTargets));

      // Sort targets
      this.sortTargets();
    },

    /**
     * Sort the targets by distance
     */
    sortTargets() {
      this.targets = [
        ...this.targets.filter((item) => item.result === 'time')
          .sort((a, b) => unitUtils.convertDistance(a.distanceValue, a.distanceUnit, 'meters')
            - unitUtils.convertDistance(b.distanceValue, b.distanceUnit, 'meters')),

        ...this.targets.filter((item) => item.result === 'distance')
          .sort((a, b) => a.time - b.time),
      ];
    },

    /**
     * Get the pace of a result
     * @param {Object} result The result
     */
    getPace(result) {
      return result.time / unitUtils.convertDistance(result.distanceValue, result.distanceUnit,
        'miles');
    },
  },

  /**
   * Close edit targets table
   */
  deactivated() {
    this.inEditMode = false;
  },
};
</script>

<style scoped>
/* time table */
.results th:last-child {
  text-align: right;
}
.results .result {
  font-weight: bold;
}

/* edit targets table */
.targets th:last-child, .targets td:last-child {
  text-align: right;
}
.targets td select {
  margin-left: 0.2em;
  width: 8em;
}
.targets tfoot td {
  text-align: center !important;
  padding: 0.5em 0.2em;
}
.targets tfoot button {
  margin: 0.5em;
}

/* general table styles */
table {
  border-collapse: collapse;
  width: 100%;
  text-align: left;
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
.empty-message svg {
  height: 1em;
  width: 1em;
  color: var(--foreground);
}
</style>
