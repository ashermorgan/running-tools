<template>
  <table class="target-editor">
    <thead>
      <tr>
        <th>
          Edit
          <input v-model="model.name" placeholder="Target set label"
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
      <tr v-for="(item, index) in model.targets" :key="index">
        <td>
          <span v-if="setType === 'workout' && customWorkoutNames">
            <input v-model="(item as WorkoutTarget).customName" aria-label="Custom target name"
              :placeholder="workoutTargetToString(item as WorkoutTarget)"/>:
          </span>

          <span v-if="setType === 'workout'">
            <decimal-input v-model="(item as WorkoutTarget).splitValue"
              aria-label="Split distance value" :min="0" :digits="2"/>
            <select v-model="(item as WorkoutTarget).splitUnit" aria-label="Split distance unit">
              <option v-for="(value, key) in DistanceUnitData" :key="key" :value="key">
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
              <option v-for="(value, key) in DistanceUnitData" :key="key" :value="key">
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

      <tr v-if="model.targets.length === 0" class="empty-message">
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

<script setup lang="ts">
import VueFeather from 'vue-feather';

import { TargetTypes, TargetSetTypes, workoutTargetToString } from '@/utils/targets';
import type { StandardTargetSet, TargetSet, WorkoutTarget, WorkoutTargetSet } from '@/utils/targets';
import { DistanceUnitData, UnitSystems, getDefaultDistanceUnit } from '@/utils/units';

import DecimalInput from '@/components/DecimalInput.vue';
import TimeInput from '@/components/TimeInput.vue';
import useObjectModel from '@/composables/useObjectModel';

interface Props {
  /**
   * Whether to allow custom names for workout targets (defaults to false)
   */
  customWorkoutNames?: boolean,
  /**
   * The unit system to use when creating distance targets (defaults to metric)
   */
  defaultUnitSystem?: UnitSystems,

  /**
   * Whether the target set is a custom or default set (defaults to false)
   */
  isCustomSet?: boolean,

  /**
   * The component value
   */
  modelValue: TargetSet,

  /**
   * The target set type (Standard, Split, or Workout, defaults to Standard)
   */
  setType?: TargetSetTypes,
}

const props = withDefaults(defineProps<Props>(), {
  customWorkoutNames: false,
  defaultUnitSystem: UnitSystems.Metric,
  isCustomSet: false,
  setType: TargetSetTypes.Standard,
});

// Declare emitted events
const emit = defineEmits(['close', 'revert', 'update:modelValue']);

// Generate internal ref tied to modelValue prop
const model = useObjectModel<TargetSet>(() => props.modelValue, (x) => emit('update:modelValue', x));

/**
 * Add a new distance based target
 */
function addDistanceTarget() {
  if (props.setType === TargetSetTypes.Workout) {
    (model.value as WorkoutTargetSet).targets.push({
      type: TargetTypes.Distance,
      distanceValue: 1,
      distanceUnit: getDefaultDistanceUnit(props.defaultUnitSystem),
      splitValue: 1,
      splitUnit: getDefaultDistanceUnit(props.defaultUnitSystem),
    });
  } else {
    (model.value as StandardTargetSet).targets.push({
      type: TargetTypes.Distance,
      distanceValue: 1,
      distanceUnit: getDefaultDistanceUnit(props.defaultUnitSystem),
    });
  }
}

/**
 * Add a new time based target
 */
function addTimeTarget() {
  if (props.setType === TargetSetTypes.Workout) {
    (model.value as WorkoutTargetSet).targets.push({
      type: TargetTypes.Time,
      time: 600,
      splitValue: 1,
      splitUnit: getDefaultDistanceUnit(props.defaultUnitSystem),
    });
  } else {
    (model.value as StandardTargetSet).targets.push({
      type: TargetTypes.Time,
      time: 600,
    });
  }
}

/**
 * Remove a target
 * @param {number} index The index of the target
 */
function removeTarget(index: number) {
  model.value.targets.splice(index, 1);
}
</script>

<style scoped>
/* edit targets table */
.target-editor th .icon {
  margin-left: 0.3em;
}
.target-editor tbody td:first-child:not(.empty-message) {
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
