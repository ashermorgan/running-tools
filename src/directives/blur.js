export default {
  mounted(el, binding) {
    el.addEventListener(binding.value ? binding.value : 'click', () => el.blur());
  },
};
