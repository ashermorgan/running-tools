<template>
  <span class="target-set-selector">
    <select v-model="internalValue" aria-label="Selected target set">
      <option v-for="(item, index) in targetSets" :key="index" :value="index">
        {{ item.name }}
      </option>
      <option value="_new">[ Create New Target Set ]</option>
    </select>

    <button class="icon" title="Edit target set" @click="$refs.dialog.showModal()">
      <vue-feather type="edit" aria-hidden="true"/>
    </button>

    <dialog ref="dialog" class="target-set-editor-dialog" aria-label="Edit target set">
      <target-editor @close="$refs.dialog.close()" v-model="targetSets[internalValue]"
        @revert="revertTargetSet"
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

      /**
       * Whether the target set is being edited
       */
      editingTargetSets: false,
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

    /**
     * Sort target set
     */
    editingTargetSets(newValue) {
      if (!newValue) {
        this.targetSets[this.internalValue].targets =
          targetUtils.sort(this.targetSets[this.internalValue].targets);
      }
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
      } else {
        // Remove custom set
        delete this.targetSets[this.internalValue];
        this.internalValue = [...Object.keys(this.targetSets), '_new'][0];
        if (this.$refs.dialog.close) this.$refs.dialog.close();
      }
    },
  },

  activated() {
    this.targetSets = storage.get('target-sets', targetUtils.defaultTargetSets);
  },
};
</script>

<style scoped>
.target-set-selector .icon {
  margin-left: 0.3em;
}
</style>
