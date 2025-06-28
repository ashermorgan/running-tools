<template>
  <span class="target-set-selector">
    <select v-model="internalValue" aria-label="Selected target set">
      <option v-for="(item, index) in targetSets" :key="index" :value="index">
        {{ item.name }}
      </option>
      <option value="_new">[ Create New Target Set ]</option>
    </select>

    <button class="icon" title="Edit target set" @click="editTargetSet()">
      <vue-feather type="edit" aria-hidden="true"/>
    </button>

    <dialog ref="dialogElement" class="target-set-editor-dialog" aria-label="Edit target set">
      <target-editor @close="sortTargetSet(); dialogElement.close()"
        @revert="revertTargetSet" :customWorkoutNames="customWorkoutNames"
        :default-unit-system="defaultUnitSystem" :setType="setType"
        v-model="targetSets[internalValue]" :isCustomSet="!internalValue.startsWith('_')"/>
    </dialog>
  </span>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

import VueFeather from 'vue-feather';

import { deepCopy } from '@/utils/misc';
import { TargetSetTypes, sort, defaultTargetSets } from '@/utils/targets';
import type { TargetSet, TargetSets } from '@/utils/targets';
import { UnitSystems } from '@/utils/units';

import TargetEditor from '@/components/TargetEditor.vue';
import useObjectModel from '@/composables/useObjectModel';

/**
 * The selected target set
 */
const model = defineModel('selectedTargetSet', {
  type: String,
  required: true,
});

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
   * The target set type (Standard, Split, or Workout, defaults to Standard)
   */
  setType?: TargetSetTypes,

  /**
   * The target sets
   */
  targetSets: TargetSets,
};


const props = withDefaults(defineProps<Props>(), {
  customWorkoutNames: false,
  defaultUnitSystem: UnitSystems.Metric,
  setType: TargetSetTypes.Standard,
});

// Generate internal ref tied to modelValue prop
const emit = defineEmits(['update:targetSets']);
const targetSets = useObjectModel<TargetSets>(() => props.targetSets, (x) => emit('update:targetSets', x));

/**
 * The dialog element
 */
const dialogElement = ref();

/**
 * The internal value
 */
const internalValue = computed({
  get: () => {
    if (model.value == '_new') {
      newTargetSet();
    }
    return model.value;
  },
  set: async (newValue: string) => {
    if (newValue == '_new') {
      await nextTick(); // <select> won't update if value changed immediately
      newTargetSet();
    } else {
      model.value = newValue;
    }
  },
});

/**
 * Open TargetEditor for the current target set
 */
function editTargetSet() {
  if (dialogElement.value && dialogElement.value.showModal) {
    // Missing in test environments, but is difficult to mock because it may be referenced on mount
    dialogElement.value.showModal();
  }
}

/**
 * Create and select a new target
 */
function newTargetSet() {
  const key = Date.now().toString();
  targetSets.value = {
    ...targetSets.value,
    [key]: {
      name: 'New target set',
      targets: [],
    },
  };
  model.value = key;
  editTargetSet();
}

/**
 * Revert or remove the current target set
 */
function revertTargetSet() {
  if (internalValue.value.startsWith('_')) {
    // Revert default set
    targetSets.value[internalValue.value] =
      deepCopy<TargetSet>(defaultTargetSets[internalValue.value]);
    sortTargetSet();
  } else {
    // Remove custom set
    delete targetSets.value[internalValue.value];
    internalValue.value = [...Object.keys(targetSets.value), '_new'][0];
    if (dialogElement.value.close) dialogElement.value.close();
  }
}

/**
 * Sort the current target set
 */
function sortTargetSet() {
  targetSets.value[internalValue.value].targets =
    sort(targetSets.value[internalValue.value].targets);
}
</script>

<style scoped>
.target-set-selector .icon {
  margin-left: 0.3em;
}

.target-set-editor-dialog {
  width: min(100% - 2em, 450px);
  max-height: min(100% - 2em, 815px);
  margin-top: 100px;
}
@media only screen and (max-height: 800px) {
  .target-set-editor-dialog {
    margin-top: 1em;
  }
}
</style>
