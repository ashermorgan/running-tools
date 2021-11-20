<template>
  <table class="target-editor">
    <thead>
      <tr>
        <th>Edit Targets</th>

        <th>
          <button class="icon" title="Reset Targets" @click="reset" v-blur>
            <rotate-ccw-icon/>
          </button>
          <button class="icon" title="Close" @click="close" v-blur>
            <x-icon/>
          </button>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, index) in internalValue" :key="index">
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
          <button class="icon" title="Remove Target" @click="removeTarget(index)" v-blur>
            <trash-2-icon/>
          </button>
        </td>
      </tr>

      <tr v-if="internalValue.length === 0" class="empty-message">
        <td colspan="2">
          There aren't any targets yet
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td colspan="2">
          <button title="Add Distance Target" @click="addDistanceTarget" v-blur>
            Add distance target
          </button>
          <button v-if="timeTargets" title="Add Time Target" @click="addTimeTarget" v-blur>
            Add time target
          </button>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import {
  RotateCcwIcon,
  Trash2Icon,
  XIcon,
} from 'vue-feather-icons';

import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

import blur from '@/directives/blur';

export default {
  name: 'TargetEditor',

  components: {
    DecimalInput,
    TimeInput,

    RotateCcwIcon,
    Trash2Icon,
    XIcon,
  },

  directives: {
    blur,
  },

  props: {
    /**
     * The targets
     */
    value: {
      type: Array,
      default: () => [],
    },

    /**
     * Whether to allow the user to add time based targets
     */
    timeTargets: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      /**
       * The internal value
       */
      internalValue: this.value,

      /**
       * The distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,
    };
  },

  watch: {
    /**
     * Update the component value when the value prop changes
     * @param {Number} newValue The new prop value
     */
    value: {
      deep: true,
      handler(newValue) {
        this.internalValue = newValue;
      },
    },

    /**
     * Emit the input event when the component value changes
     * @param {Number} newValue The new component value
     */
    internalValue: {
      deep: true,
      handler(newValue) {
        this.$emit('input', newValue);
      },
    },
  },

  methods: {
    /**
     * Restore the default targets
     */
    reset() {
      // Emit reset event
      this.$emit('reset');
    },

    /**
     * Close the target editor
     */
    close() {
      // Emit close event
      this.$emit('close');
    },

    /**
     * Add a new distance based target
     */
    addDistanceTarget() {
      this.internalValue.push({
        result: 'time',
        distanceValue: 1,
        distanceUnit: unitUtils.getDefaultDistanceUnit(),
      });
    },

    /**
     * Add a new time based target
     */
    addTimeTarget() {
      this.internalValue.push({
        result: 'distance',
        time: 600,
      });
    },

    /**
     * Remove a target
     * @param {Number} index The index of the target
     */
    removeTarget(index) {
      this.internalValue.splice(index, 1);
    },
  },
};
</script>

<style scoped>
/* edit targets table */
.target-editor th:last-child, .target-editor td:last-child {
  text-align: right;
}
.target-editor td select {
  margin-left: 0.2em;
  width: 8em;
}
.target-editor tfoot td {
  text-align: center !important;
  padding: 0.5em 0.2em;
}
.target-editor tfoot button {
  margin: 0.5em;
}
</style>
