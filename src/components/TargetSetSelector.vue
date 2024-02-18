<template>
  <span class="target-set-selector">
    <select v-model="internalValue" aria-label="Selected target set">
      <option v-for="(item, index) in targetSets" :key="index" :value="index">
        {{ item.name }}
      </option>
      <option value="_new">[ Create New Target Set ]</option>
    </select>

    <button class="icon" title="Edit target set"
      @click="reloadTargetSets(); sortTargetSet(); $refs.dialog.showModal()">
      <vue-feather type="edit" aria-hidden="true"/>
    </button>

    <dialog ref="dialog" class="target-set-editor-dialog" aria-label="Edit target set">
      <target-editor @close="$refs.dialog.close()" v-model="targetSets[internalValue]"
        @revert="revertTargetSet" :default-unit-system="defaultUnitSystem"
        :isCustomSet="!internalValue.startsWith('_')"/>
    </dialog>
  </span>
</template>

<script>
import VueFeather from 'vue-feather';

import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';

import TargetEditor from '@/components/TargetEditor.vue';

export default {
  name: 'TargetSetSelector',

  components: {
    TargetEditor,
    VueFeather,
  },

  props: {
    /**
     * The selected target set
     */
    modelValue: {
      type: String,
      default: '_new',
    },

    /**
     * The unit system to use when creating distance targets
     */
    defaultUnitSystem: {
      type: String,
      default: 'metric',
    },
  },

  data() {
    return {
      /**
       * The internal value
       */
      internalValue: this.modelValue,

      /**
       * The target sets
       */
      targetSets: storage.get('target-sets', targetUtils.defaultTargetSets),
    };
  },

  watch: {
    /**
     * Update the component value when the modelValue prop changes
     */
    modelValue(newValue) {
      if (newValue !== this.internalValue) {
        this.internalValue = newValue;
      }
    },

    /**
     * Emit the input event when the component value changes and create a new set if necessary
     */
    internalValue: {
      immediate: true,
      handler(newValue) {
        if (newValue == '_new') {
          let key = Date.now().toString();
          this.targetSets[key] = {
            name: 'New target set',
            targets: [],
          };
          this.internalValue = key;
        } else {
          this.$emit('update:modelValue', newValue);
        }
      },
    },

    /**
     * Save target sets
     */
    targetSets: {
      deep: true,
      handler(newValue) {
        storage.set('target-sets', newValue);
        this.$emit('targets-updated');
      },
    },
  },

  methods: {
    /**
     * Revert or remove the current target set
     */
    revertTargetSet() {
      if (this.internalValue.startsWith('_')) {
        // Revert default set
        this.targetSets[this.internalValue] =
          JSON.parse(JSON.stringify(targetUtils.defaultTargetSets[this.internalValue]));
        this.sortTargetSet();
      } else {
        // Remove custom set
        delete this.targetSets[this.internalValue];
        this.internalValue = [...Object.keys(this.targetSets), '_new'][0];
        if (this.$refs.dialog.close) this.$refs.dialog.close();
      }
    },

    /**
     * Sort the current target set
     */
    sortTargetSet() {
      this.targetSets[this.internalValue].targets =
        targetUtils.sort(this.targetSets[this.internalValue].targets);
    },

    /**
     * Reload the target sets
     */
    reloadTargetSets() {
      this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
    },
  },

  activated() {
    this.reloadTargetSets();
  },
};
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
