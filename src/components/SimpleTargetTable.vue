<template>
  <div class="simple-target-table">
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
            {{ formatNumber(item.distanceValue, 0, 2, item.result === 'distance') }}
            {{ distanceUnits[item.distanceUnit].symbol }}
          </td>

          <td :colspan="showPace ? 1 : 2" :class="item.result === 'time' ? 'result' : ''">
            {{ formatDuration(item.time, 3, 2, item.result === 'time') }}
          </td>

          <td v-if="showPace" colspan="2">
            {{ formatDuration(getPace(item), 3, 0, true) }}
            / {{ distanceUnits[getDefaultDistanceUnit()].symbol }}
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

    <target-editor v-show="inEditMode" v-model="targets" @close="inEditMode=false"
      @reset="resetTargets"/>
  </div>
</template>

<script>
import {
  EditIcon,
} from 'vue-feather-icons';

import formatUtils from '@/utils/format';
import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import TargetEditor from '@/components/TargetEditor.vue';

import blur from '@/directives/blur';

export default {
  name: 'SimpleTargetTable',

  components: {
    TargetEditor,

    EditIcon,
  },

  directives: {
    blur,
  },

  props: {
    /**
     * The method that generates the target table rows
     */
    calculateResult: {
      type: Function,
      required: true,
    },

    /**
     * The default targets
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
       * Whether the table is in edit mode
       */
      inEditMode: false,

      /**
       * The target table targets
       */
      targets: storage.get(this.storageKey, this.defaultTargets),
    };
  },

  computed: {
    /**
     * The target table results
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
      this.targets = targetUtils.sort(this.targets);
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
      this.targets = targetUtils.sort(this.targets);
    },

    /**
     * Get the pace of a result
     * @param {Object} result The result
     */
    getPace(result) {
      return result.time / unitUtils.convertDistance(result.distanceValue, result.distanceUnit,
        unitUtils.getDefaultDistanceUnit());
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
/* target table */
.results th:last-child {
  text-align: right;
}
.results .result {
  font-weight: bold;
}
</style>
