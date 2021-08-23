import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import IntInput from '@/components/IntInput.vue';

describe('components/IntInput.vue', () => {
  it('value should be 0 by default', () => {
    // Initialize component
    const wrapper = mount(IntInput);

    // Assert value is 0
    expect(wrapper.find('input').element.value).to.equal('0');
  });

  it('should read value prop', () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { value: 1 },
    });

    // Assert value is 1
    expect(wrapper.find('input').element.value).to.equal('1');
  });

  it('up arrow should increment value', async () => {
    // Initialize component
    const wrapper = mount(IntInput);

    // Press up arrow
    await wrapper.trigger('keydown', { key: 'ArrowUp' });

    // Assert value is 1 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.deep.equal([[1]]);
  });

  it('down arrow should increment value', async () => {
    // Initialize component
    const wrapper = mount(IntInput);

    // Press down arrow
    await wrapper.trigger('keydown', { key: 'ArrowDown' });

    // Assert value is -1 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('-1');
    expect(wrapper.emitted().input).to.deep.equal([[-1]]);
  });

  it('should fire input event when value changes', async () => {
    // Initialize component
    const wrapper = mount(IntInput);

    // Set value to 1
    wrapper.find('input').element.value = '1';
    await wrapper.find('input').trigger('input');

    // Assert input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([[1]]);
  });

  it('should accept numerical values', async () => {
    // Initialize component
    const wrapper = mount(IntInput);

    // Try to set value to 1
    wrapper.find('input').element.value = '1';
    await wrapper.find('input').trigger('input');

    // Assert value was accepted and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.deep.equal([[1]]);
  });

  it('should not accept decimal values', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { value: 1 },
    });

    // Try to set value to 1.5
    wrapper.find('input').element.value = '1.5';
    await wrapper.find('input').trigger('input');

    // Assert value was not accepted and no events were emitted
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.equal(undefined);
  });

  it('should not accept non numerical values', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { value: 1 },
    });

    // Try to set value to a
    wrapper.find('input').element.value = 'a';
    await wrapper.find('input').trigger('input');

    // Assert value was not accepted and no events were emitted
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.equal(undefined);
  });

  it('should format input value on blur', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { value: 1, padding: 3 },
    });

    // Set value to '01'
    wrapper.find('input').element.value = '01';
    await wrapper.find('input').trigger('input');

    // Assert value was not updated and no events were emitted
    expect(wrapper.find('input').element.value).to.equal('01');
    expect(wrapper.emitted().input).to.equal(undefined);

    // Trigger blur event
    await wrapper.find('input').trigger('blur');

    // Assert value was formatted but no events were emitted
    expect(wrapper.find('input').element.value).to.equal('001');
    expect(wrapper.emitted().input).to.equal(undefined);
  });

  it('should allow input to be empty until blur', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { value: 5 },
    });

    // Set value to ''
    wrapper.find('input').element.value = '';
    await wrapper.find('input').trigger('input');

    // Assert value is '' and input event was emitted with default value
    expect(wrapper.find('input').element.value).to.equal('');
    expect(wrapper.emitted().input).to.deep.equal([[0]]);

    // Trigger blur event
    await wrapper.find('input').trigger('blur');

    // Assert value is the default value but no new events were emitted
    expect(wrapper.find('input').element.value).to.equal('0');
    expect(wrapper.emitted().input).to.deep.equal([[0]]);
  });

  it('should allow input to be "-" until blur', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { value: 5 },
    });

    // Set value to '-'
    wrapper.find('input').element.value = '-';
    await wrapper.find('input').trigger('input');

    // Assert value is '-' and input event was emitted with default value
    expect(wrapper.find('input').element.value).to.equal('-');
    expect(wrapper.emitted().input).to.deep.equal([[0]]);

    // Trigger blur event
    await wrapper.find('input').trigger('blur');

    // Assert value is the default value but no new events were emitted
    expect(wrapper.find('input').element.value).to.equal('0');
    expect(wrapper.emitted().input).to.deep.equal([[0]]);
  });

  it('default value should be the minimum if 0 is not valid', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { value: 3, max: 4, min: 2 },
    });

    // Set value to '' and trigger blur event so value must be updated
    wrapper.find('input').element.value = '';
    await wrapper.find('input').trigger('input');
    await wrapper.find('input').trigger('blur');

    // Assert value is 2 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('2');
    expect(wrapper.emitted().input).to.deep.equal([[2]]);
  });

  it('should not allow input to be below the minimum', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { min: 10, value: 20 },
    });

    // Try to set value to 9, which is below the minimum
    wrapper.find('input').element.value = '9';
    await wrapper.find('input').trigger('input');

    // Assert value is 10 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('10');
    expect(wrapper.emitted().input).to.deep.equal([[10]]);

    // Try to decrement value
    await wrapper.trigger('keydown', { key: 'ArrowDown' });

    // Assert value is still 10 and no new event were emitted
    expect(wrapper.find('input').element.value).to.equal('10');
    expect(wrapper.emitted().input).to.deep.equal([[10]]);
  });

  it('should not allow input to be above the maximum', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { max: 10 },
    });

    // Try to set value to 11, which is above the maximum
    wrapper.find('input').element.value = '11';
    await wrapper.find('input').trigger('input');

    // Assert value is 10 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('10');
    expect(wrapper.emitted().input).to.deep.equal([[10]]);

    // Try to increment value
    await wrapper.trigger('keydown', { key: 'ArrowUp' });

    // Assert value is still 10 and no new events were emitted
    expect(wrapper.find('input').element.value).to.equal('10');
    expect(wrapper.emitted().input).to.deep.equal([[10]]);
  });

  it('should format value according to padding prop', async () => {
    // Initialize component
    const wrapper = mount(IntInput, {
      propsData: { padding: 2 },
    });

    // Assert value is correctly formatted
    expect(wrapper.find('input').element.value).to.equal('00');
  });
});
