/* eslint-disable no-underscore-dangle */

import { expect } from 'chai';
import { shallowMount, mount } from '@vue/test-utils';
import TargetEditor from '@/components/TargetEditor.vue';

describe('components/TargetEditor.vue', () => {
  it('addDistanceTarget method should correctly add distance target', async () => {
    // Initialize component
    const wrapper = shallowMount(TargetEditor);

    // Add distance target
    await wrapper.vm.addDistanceTarget();

    // Assert input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([
      [[
        { distanceUnit: 'miles', distanceValue: 1, result: 'time' },
      ]],
    ]);
  });

  it('addTimeTarget method should correctly add time target', async () => {
    // Initialize component
    const wrapper = shallowMount(TargetEditor);

    // Add time target
    await wrapper.vm.addTimeTarget();

    // Assert input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([
      [[
        { time: 600, result: 'distance' },
      ]],
    ]);
  });

  it('should emit input event when targets are updated', async () => {
    // Initialize component
    const wrapper = mount(TargetEditor, {
      propsData: {
        value: [
          { distanceUnit: 'miles', distanceValue: 2, result: 'time' },
        ],
      },
    });

    // Update distance value
    await wrapper.find('tbody input').trigger('keydown', { key: 'ArrowUp' });

    // Assert input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([
      [[
        { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
      ]],
    ]);
  });

  it('removeTarget method should correctly remove target', async () => {
    // Initialize component
    const wrapper = shallowMount(TargetEditor, {
      propsData: {
        value: [
          { distanceUnit: 'miles', distanceValue: 1, result: 'time' },
          { distanceUnit: 'miles', distanceValue: 2, result: 'time' },
          { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
        ],
      },
    });

    // Remove 2nd target
    await wrapper.vm.removeTarget(1);

    // Assert input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([
      [[
        { distanceUnit: 'miles', distanceValue: 1, result: 'time' },
        { distanceUnit: 'miles', distanceValue: 3, result: 'time' },
      ]],
    ]);
  });
});
