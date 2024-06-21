<template>
  <table class="target-editor">
    <thead>
      <tr>
        <th>
          Edit
          <input v-model="internalValue.name" placeholder="Target set label"
            aria-label="Target set label"/>
          <button class="icon" :title="isCustomSet ? 'Delete target set' : 'Revert target set'"
            @click="emit('revert')">
            <vue-feather :type="isCustomSet ? 'trash-2' : 'rotate-ccw'" aria-hidden="true"/>
          </button>
        </th>

        <th>
          <button class="icon" title="Close" @click="emit('close')">
            <vue-feather type="x" aria-hidden="true"/>
          </button>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, index) in internalValue.targets" :key="index">
        <td>
          <span v-if="setType === 'workout'">
            <decimal-input v-model="item.splitValue" aria-label="Split distance value"
              :min="0" :digits="2"/>
            <select v-model="item.splitUnit" aria-label="Split distance unit">
              <option v-for="(value, key) in DISTANCE_UNITS" :key="key" :value="key">
                {{ value.name }}
              </option>
            </select>
          </span>

          <span v-if="setType === 'workout'">
            &nbsp;@&nbsp;
          </span>

          <span v-if="item.type === 'distance'">
            <decimal-input v-model="item.distanceValue" aria-label="Target distance value"
              :min="0" :digits="2"/>
            <select v-model="item.distanceUnit" aria-label="Target distance unit">
              <option v-for="(value, key) in DISTANCE_UNITS" :key="key" :value="key">
                {{ value.name }}
              </option>
            </select>
          </span>

          <span v-else>
            <time-input v-model="item.time" label="Target duration"/>
          </span>
        </td>

        <td>
          <button class="icon" title="Remove target" @click="removeTarget(index)">
            <vue-feather type="trash-2" aria-hidden="true"/>
          </button>
        </td>
      </tr>

      <tr v-if="internalValue.targets.length === 0" class="empty-message">
        <td colspan="2">
          There aren't any targets in this set yet.
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td colspan="2">
          <button title="Add distance target" @click="addDistanceTarget">
            Add distance target
          </button>
          <button title="Add time target" @click="addTimeTarget" v-if="setType !== 'split'">
            Add time target
          </button>
        </td>
      </tr>
    </tfoot>
  </table>
</template>

<script setup>
import { watch, ref } from 'vue';

import VueFeather from 'vue-feather';

import { DISTANCE_UNITS, getDefaultDistanceUnit } from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';

/**
 * The component value
 */
const model = defineModel({
  type: Object,
  default: {
    name: 'New target set',
    targets: [],
  }
});

const props = defineProps({
  /**
   * Whether the target set is a custom or default set
   */
  isCustomSet: {
    type: Boolean,
    default: false,
  },

  /**
   * The unit system to use when creating distance targets
   */
  defaultUnitSystem: {
    type: String,
    default: 'metric',
  },

  /**
   * The target set type ('standard', 'split', or 'workout')
   */
  setType: {
    type: String,
    default: 'standard'
  },
});

// Declare emitted events
const emit = defineEmits(['revert', 'close']);

/**
 * The internal value
 */
const internalValue = ref(model.value);

/**
 * Update the internal value when the component value changes
 */
watch(model, (newValue) => {
    internalValue.value = newValue;
}, { deep: true });

/**
 * Update the component value when the internal value changes
 */
watch(internalValue, (newValue) => {
  model.value = newValue;
}, { deep: true });

/**
 * Add a new distance based target
 */
function addDistanceTarget() {
  if (props.setType === 'workout') {
    internalValue.value.targets.push({
      type: 'distance',
      distanceValue: 1,
      distanceUnit: getDefaultDistanceUnit(props.defaultUnitSystem),
      splitValue: 1,
      splitUnit: getDefaultDistanceUnit(props.defaultUnitSystem),
    });
  } else {
    internalValue.value.targets.push({
      type: 'distance',
      distanceValue: 1,
      distanceUnit: getDefaultDistanceUnit(props.defaultUnitSystem),
    });
  }
}

/**
 * Add a new time based target
 */
function addTimeTarget() {
  if (props.setType === 'workout') {
    internalValue.value.targets.push({
      type: 'time',
      time: 600,
      splitValue: 1,
      splitUnit: getDefaultDistanceUnit(props.defaultUnitSystem),
    });
  } else {
    internalValue.value.targets.push({
      type: 'time',
      time: 600,
    });
  }
}

/**
 * Remove a target
 * @param {Number} index The index of the target
 */
function removeTarget(index) {
  internalValue.value.targets.splice(index, 1);
}
</script>

<style scoped>
/* edit targets table */
.target-editor th .icon {
  margin-left: 0.3em;
}
.target-editor tbody td:first-child::not(.empty-message) {
  display: flex;
  gap: 0.2em;
  flex-wrap: wrap;
  align-items: center;
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
@media only screen and (max-width: 800px) {
  /* leave space for revert button on mobile devices */
  .target-editor th input {
    width: 12em;
  }
}
</style>
