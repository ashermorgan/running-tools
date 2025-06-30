import { ref, watch } from 'vue';
import type { Ref } from 'vue';

import { deepCopy, deepEqual } from '@/utils/misc';

/*
 * Generate an internal ref that implements support for v-model with objects
 * @param {Function} prop A function returning the prop
 * @param {Function} emit A function for emitting update events
 * @returns {Ref<object>} The internal ref
 */
export default function defineObjectModel<T>(prop: () => T, emit: (x: T) => void): Ref<T> {
  /**
   * The internal value
   */
  const internalValue: Ref<T> = ref<T>(prop()) as Ref<T>;

  /**
   * Update the internal value when the component value changes
   */
  watch(prop, (newValue: T) => {
    if (!deepEqual<T>(internalValue.value, newValue)) {
      internalValue.value = deepCopy<T>(newValue);
    }
  }, { deep: true });

  /**
   * Update the component value when the internal value changes
   */
  watch(internalValue, (newValue: T) => {
    emit(deepCopy<T>(newValue));
  }, { deep: true });

  return internalValue;
}
