<template>
  <span class="target-set-selector">
    <select v-model="internalValue" aria-label="Selected target set">
      <option v-for="(item, index) in targetSets" :key="index" :value="index">
        {{ item.name }}
      </option>
      <option value="_new">[ Create New Target Set ]</option>
    </select>

    <button class="icon" title="Edit target set" @click="dialogElement.showModal()">
      <vue-feather type="edit" aria-hidden="true"/>
    </button>

    <dialog ref="dialogElement" class="target-set-editor-dialog" aria-label="Edit target set">
      <target-editor @close="sortTargetSet(); dialogElement.close()"
        @revert="revertTargetSet" :default-unit-system="defaultUnitSystem" :setType="setType"
        v-model="targetSets[internalValue]" :isCustomSet="!internalValue.startsWith('_')"/>
    </dialog>
  </span>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue';

import VueFeather from 'vue-feather';

import targetUtils from '@/utils/targets';

import TargetEditor from '@/components/TargetEditor.vue';

/**
 * The selected target set
 */
const model = defineModel('selectedTargetSet', {
  type: String,
  default: '_new',
});

/**
 * The target sets
 */
const targetSets = defineModel('targetSets', {
  type: Object,
  default: {},
});

defineProps({
  /**
   * The unit system to use when creating distance targets
   */
  defaultUnitSystem: {
    type: String,
    default: 'metric',
  },

  /**
   * The target set type ('standard' or 'split')
   */
  setType: {
    type: String,
    default: 'standard'
  },
});

/**
 * The internal value
 */
const internalValue = ref(model.value);

/**
 * The dialog element
 */
const dialogElement = ref(null);

/**
 * Update the internal value when the component value changes
 */
watch(model, (newValue) => {
  if (newValue !== internalValue.value) {
    internalValue.value = newValue;
  }
});

/**
 * Update the component value when the internal value changes and create a new set if necessary
 */
watch(internalValue, async (newValue) => {
  if (newValue == '_new') {
    let key = Date.now().toString();
    targetSets.value[key] = {
      name: 'New target set',
      targets: [],
    };
    await nextTick(); // <select> won't update if value changed immediately
    model.value = key;
  } else {
    model.value = newValue;
  }
}, { immediate: true });

/**
 * Revert or remove the current target set
 */
function revertTargetSet() {
  if (internalValue.value.startsWith('_')) {
    // Revert default set
    targetSets.value[internalValue.value] =
      JSON.parse(JSON.stringify(targetUtils.defaultTargetSets[internalValue.value]));
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
    targetUtils.sort(targetSets.value[internalValue.value].targets);
}
</script>

<style scoped>
.target-set-selector .icon {
  margin-left: 0.3em;
}

.target-set-editor-dialog {
  width: min(100% - 2em, 400px);
  max-height: min(100% - 2em, 815px);
  margin-top: 100px;
}
@media only screen and (max-height: 800px) {
  .target-set-editor-dialog {
    margin-top: 1em;
  }
}
</style>
