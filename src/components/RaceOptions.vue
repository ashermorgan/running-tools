<template>
  <div>
    Prediction Model:
    <select v-model="model.model" aria-label="Prediction model">
      <option value="AverageModel">Average</option>
      <option value="PurdyPointsModel">Purdy Points Model</option>
      <option value="VO2MaxModel">V&#775;O&#8322; Max Model</option>
      <option value="CameronModel">Cameron's Model</option>
      <option value="RiegelModel">Riegel's Model</option>
    </select>
  </div>
  <div>
    Riegel Exponent:
    <decimal-input v-model="model.riegelExponent" aria-label="Riegel exponent" :min="1" :max="1.3"
      :digits="2" :step="0.01"/>
      (default: 1.06)
  </div>
</template>

<script setup>
import DecimalInput from '@/components/DecimalInput.vue';

const model = defineModel({
  type: Object,
  default: {
    model: 'AverageModel',
    riegelExponent: 1.06,
  },
});
</script>
