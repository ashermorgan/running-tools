export default {
  inserted(el, binding) {
    el.addEventListener(binding.value ? binding.value : 'click', () => el.blur());
  },
};
