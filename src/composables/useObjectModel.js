import { ref, watch } from 'vue';

import { deepCopy, deepEqual } from '@/utils/misc';

/*
 * Generate an internal ref that implements support for v-model with objects
 * @param {Object} props The props object
 * @param {Object} emit The emit object
 * @param {String} name The name of the v-model prop
 * @returns {Object} The internal ref
 */
export default function defineObjectModel(props, emit, name) {
  /**
   * The internal value
   */
  const internalValue = ref(deepCopy(props[name]));

  /**
   * Update the internal value when the component value changes
   */
  watch(() => props[name], (newValue) => {
    if (!deepEqual(internalValue.value, newValue)) {
      internalValue.value = deepCopy(newValue);
    }
  }, { deep: true });

  /**
   * Update the component value when the internal value changes
   */
  watch(internalValue, (newValue) => {
    emit(`update:${name}`, deepCopy(newValue));
  }, { deep: true });

  return internalValue;
}
