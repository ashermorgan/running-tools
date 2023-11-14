<template>
  <div class="target-set-editor">
    <table v-show="selectedTargetSet === null">
      <thead>
        <tr>
          <th>
            Edit Target Sets
          </th>
          <th>
            <button class="icon" title="Restore Default Sets" @click="reset" v-blur>
              <vue-feather type="rotate-ccw"/>
            </button>
            <button class="icon" title="Close" @click="close" v-blur>
              <vue-feather type="x"/>
            </button>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(item, key) in internalValue" :key="key">
          <td>
            {{ item.name }}
          </td>
          <td>
            <button class="icon" title="Edit Set" @click="editTargetSet(key)" v-blur>
              <vue-feather type="edit"/>
            </button>
            <button class="icon" title="Delete Set" @click="removeTargetSet(key)" v-blur>
              <vue-feather type="trash-2"/>
            </button>
          </td>
        </tr>

        <tr v-if="Object.keys(internalValue).length === 0" class="empty-message">
          <td colspan="2">
            There aren't any target sets yet
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td colspan="2">
            <button title="Add Target Set" @click="addTargetSet" v-blur>
              Add Target Set
            </button>
          </td>
        </tr>
      </tfoot>
    </table>

    <target-editor v-model="internalValue[selectedTargetSet]" v-if="selectedTargetSet !== null"
      @close="selectedTargetSet = null"/>

    <p v-if="selectedTargetSet !== null">
      Note: time targets are ignored by the Split Calculator
    </p>
  </div>
</template>

<script>
import VueFeather from 'vue-feather';

import storage from '@/utils/localStorage';
import targetUtils from '@/utils/targets';
import unitUtils from '@/utils/units';

import TargetEditor from '@/components/TargetEditor.vue';

import blur from '@/directives/blur';

export default {
  name: 'TargetSetEditor',

  components: {
    TargetEditor,
    VueFeather,
  },

  directives: {
    blur,
  },

  data() {
    return {
      /**
       * The internal value
       */
      internalValue: storage.get('target-sets', targetUtils.defaultTargetSets),

      /**
       * The target set currently being edited
       */
      selectedTargetSet: null,

      /**
       * The distance units
       */
      distanceUnits: unitUtils.DISTANCE_UNITS,
    };
  },

  watch: {
    /**
     * Save target sets
     */
    internalValue: {
      deep: true,
      handler(newValue) {
        storage.set('target-sets', newValue);
      },
    },

    /**
     * Sort current target set
     */
    selectedTargetSet(newValue, oldValue) {
      let value = newValue !== null ? newValue : oldValue;
      this.internalValue[value].targets = targetUtils.sort(this.internalValue[value].targets);
    },
  },

  methods: {
    /**
     * Restore the default target sets
     */
    reset() {
      let old_sets = this.internalValue;
      this.internalValue = JSON.parse(JSON.stringify(targetUtils.defaultTargetSets));
      for (let key in old_sets) {
        if (!Object.keys(this.internalValue).includes(key)) {
          this.internalValue[key] = old_sets[key];
        }
      }
    },

    /**
     * Close the target editor
     */
    close() {
      // Emit close event
      this.$emit('close');
    },

    /**
     * Add a new target set
     */
    addTargetSet() {
      let key = Date.now().toString()
      this.internalValue[key] = {
        name: 'New target set',
        targets: [],
      }
      this.editTargetSet(key);
    },

    /**
     * Edit a target set
     */
    editTargetSet(key) {
      this.selectedTargetSet = key;
    },

    /**
     * Remove a target set
     */
    removeTargetSet(key) {
      delete this.internalValue[key]
    },
  },

  /**
   * Close target editor
   */
  deactivated() {
    this.selectedTargetSet = null;
  },
};
</script>

<style scoped>
/* container */
.target-set-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.target-set-editor table {
  max-width: 500px;
}
h2 {
  font-size: 1.3em;
  margin-bottom: 0.2em;
}

/* tables */
.target-set-editor table th:last-child, .target-set-editor table td:last-child {
  text-align: right;
}
.target-set-editor table td select {
  margin-left: 0.2em;
  width: 8em;
}
.target-set-editor table tfoot td {
  text-align: center !important;
  padding: 0.5em 0.2em;
}
.target-set-editor table tfoot button {
  margin: 0.5em;
}

/* note about split calculator */
.target-set-editor p {
  margin-top: 0.5em;
}
</style>
