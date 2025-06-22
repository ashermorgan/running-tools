import { ref, watch } from 'vue';
import type { Ref } from 'vue';

import { deepCopy, deepEqual } from '@/utils/misc';

/*
 * Generate an internal ref that implements support for v-model with objects
 * @param {Function} prop A function returning the prop
 * @param {Function} emit The emit function
 * @param {string} name The name of the v-model prop
 * @returns {Ref<object>} The internal ref
 */
export default function defineObjectModel(prop: () => Ref<object>,
                                          emit: (x: string, y: object) => void,
                                          name: string): Ref<object> {
  /**
   * The internal value
   */
  const internalValue = ref(deepCopy(prop()));

  /**
   * Update the internal value when the component value changes
   */
  watch(prop, (newValue: object) => {
    if (!deepEqual(internalValue.value, newValue)) {
      internalValue.value = deepCopy(newValue);
    }
  }, { deep: true });

  /**
   * Update the component value when the internal value changes
   */
  watch(internalValue, (newValue: object) => {
    emit(`update:${name}`, deepCopy(newValue));
  }, { deep: true });

  return internalValue;
}
