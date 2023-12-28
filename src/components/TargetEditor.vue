<template>
  <table class="target-editor">
    <thead>
      <tr>
        <th>
          Edit
          <input v-model="internalValue.name" placeholder="Target set label"/>
          <button class="icon" :title="isCustomSet ? 'Delete Target Set' : 'Revert Target Set'"
            @click="revert">
            <vue-feather :type="isCustomSet ? 'trash-2' : 'rotate-ccw'"/>
          </button>
        </th>

        <th>
          <button class="icon" title="Close" @click="close">
            <vue-feather type="x"/>
          </button>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, index) in internalValue.targets" :key="index">
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
          <button class="icon" title="Remove Target" @click="removeTarget(index)">
            <vue-feather type="trash-2"/>
          </button>
        </td>
      </tr>

      <tr v-if="internalValue.targets.length === 0" class="empty-message">
        <td colspan="2">
          There aren't any targets in this set yet
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td colspan="2">
          <button title="Add Distance Target" @click="addDistanceTarget">
            Add distance target
          </button>
          <button v-if="timeTargets" title="Add Time Target" @click="addTimeTarget">
            Add time target
          </button>
          <br/>
          <p>Note: time targets are ignored by the Split Calculator</p>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script>
import VueFeather from 'vue-feather';

import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

export default {
  name: 'TargetEditor',

  components: {
    DecimalInput,
    TimeInput,
    VueFeather,
  },

  props: {
    /**
     * The targets
     */
    modelValue: {
      type: Object,
      default: JSON.parse(JSON.stringify(targetUtils.defaultTargetSet)),
    },

    /**
     * Whether to allow the user to add time based targets
     */
    timeTargets: {
      type: Boolean,
      default: true,
    },

    /**
     * Whether the target set is a custom or default set
     */
    isCustomSet: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      /**
       * The internal value
       */
      internalValue: this.modelValue,

      /**
       * The distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,
    };
  },

  watch: {
    /**
     * Update the component value when the modelValue prop changes
     * @param {Number} newValue The new prop value
     */
    modelValue: {
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
        this.$emit('update:modelValue', newValue);
      },
    },
  },

  methods: {
    /**
     * Revert the target set
     */
    revert() {
      // Emit revert event
      this.$emit('revert');
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
      this.internalValue.targets.push({
        result: 'time',
        distanceValue: 1,
        distanceUnit: unitUtils.getDefaultDistanceUnit(),
      });
    },

    /**
     * Add a new time based target
     */
    addTimeTarget() {
      this.internalValue.targets.push({
        result: 'distance',
        time: 600,
      });
    },

    /**
     * Remove a target
     * @param {Number} index The index of the target
     */
    removeTarget(index) {
      this.internalValue.targets.splice(index, 1);
    },
  },
};
</script>

<style scoped>
/* edit targets table */
.target-editor th .icon {
  margin-left: 0.3em;
}
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
.target-editor tfoot p {
  margin-top: 0.5em;
}
@media only screen and (max-width: 800px) {
  /* leave space for revert button on mobile devices */
  .target-editor th input {
    width: 12em;
  }
}
</style>
