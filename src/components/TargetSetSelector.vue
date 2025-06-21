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

<script setup>
import { computed, nextTick, ref } from 'vue';

import VueFeather from 'vue-feather';

import { sort, defaultTargetSets } from '@/utils/targets';

import TargetEditor from '@/components/TargetEditor.vue';
import useObjectModel from '@/composables/useObjectModel';

/**
 * The selected target set
 */
const model = defineModel('selectedTargetSet', {
  type: String,
  default: '_new',
});

const props = defineProps({
  /**
   * Whether to allow custom names for workout targets
   */
  customWorkoutNames: {
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

  /**
   * The target sets
   */
  targetSets: {
    type: Object,
    default: () => ({}),
  },
});

// Generate internal ref tied to modelValue prop
const emit = defineEmits(['update:targetSets']);
const targetSets = useObjectModel(props, emit, 'targetSets');

/**
 * The dialog element
 */
const dialogElement = ref(null);

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
  set: async (newValue) => {
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
  let key = Date.now().toString();
  targetSets.value[key] = {
    name: 'New target set',
    targets: [],
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
      JSON.parse(JSON.stringify(defaultTargetSets[internalValue.value]));
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
