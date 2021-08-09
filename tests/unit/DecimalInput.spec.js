import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import DecimalInput from '@/components/DecimalInput.vue';

describe('DecimalInput.vue', () => {
  it('value should be 0.0 by default', () => {
    // Initialize component
    const wrapper = mount(DecimalInput);

    // Assert value is 0.0
    expect(wrapper.find('input').element.value).to.equal('0.0');
  });

  it('should read value prop', () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { value: 1 }
    });

    // Assert value is 1.0
    expect(wrapper.find('input').element.value).to.equal('1.0');
  });

  it('up arrow should increment value', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput);

    // Press up arrow
    await wrapper.trigger('keydown', { key: 'ArrowUp' });

    // Assert value is 1.0 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('1.0');
    expect(wrapper.emitted().input).to.deep.equal([[1.0]]);
  });

  it('down arrow should increment value', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput);

    // Press down arrow
    await wrapper.trigger('keydown', { key: 'ArrowDown' });

    // Assert value is -1.0 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('-1.0');
    expect(wrapper.emitted().input).to.deep.equal([[-1.0]]);
  });

  it('should fire input event when value changes', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput);

    // Set value to 1
    wrapper.find('input').element.value = '1.0';
    await wrapper.find('input').trigger('input');

    // Assert input event was emitted
    expect(wrapper.emitted().input).to.deep.equal([[1.0]]);
  });

  it('should accept numerical values', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput);

    // Try to set value to 1
    wrapper.find('input').element.value = '1';
    await wrapper.find('input').trigger('input');

    // Assert value was accepted and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.deep.equal([[1.0]]);
  });

  it('should accept decimal values', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { value: 1 }
    });

    // Try to set value to 1.5
    wrapper.find('input').element.value = '1.5';
    await wrapper.find('input').trigger('input');

    // Assert value was accepted and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('1.5');
    expect(wrapper.emitted().input).to.deep.equal([[1.5]]);
  });

  it('should not accept non numerical values', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { value: 1 }
    });

    // Try to set value to a
    wrapper.find('input').element.value = 'a';
    await wrapper.find('input').trigger('input');

    // Assert value was not accepted and no events were emitted
    expect(wrapper.find('input').element.value).to.equal('1.0');
    expect(wrapper.emitted().input).to.be.undefined;
  });

  it('should format input value on blur', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { value: 1 }
    });

    // Set value to '01'
    wrapper.find('input').element.value = '01';
    await wrapper.find('input').trigger('input');

    // Assert value was not updated and no events were emitted
    expect(wrapper.find('input').element.value).to.equal('01');
    expect(wrapper.emitted().input).to.be.undefined;

    // Trigger blur event
    await wrapper.find('input').trigger('blur');

    // Assert value was formatted but no events were emitted
    expect(wrapper.find('input').element.value).to.equal('1.0');
    expect(wrapper.emitted().input).to.be.undefined;
  });

  it('should allow input to be empty until blur', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { value: 5 }
    });

    // Set value to ''
    wrapper.find('input').element.value = '';
    await wrapper.find('input').trigger('input');

    // Assert value is '' and input event was emitted with default value
    expect(wrapper.find('input').element.value).to.equal('');
    expect(wrapper.emitted().input).to.deep.equal([[0.0]]);

    // Trigger blur event
    await wrapper.find('input').trigger('blur');

    // Assert value is the default value but no new events were emitted
    expect(wrapper.find('input').element.value).to.equal('0.0');
    expect(wrapper.emitted().input).to.deep.equal([[0.0]]);
  });

  it('should allow input to be "-" until blur', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { value: 5 }
    });

    // Set value to '-'
    wrapper.find('input').element.value = '-';
    await wrapper.find('input').trigger('input');

    // Assert value is '-' and input event was emitted with default value
    expect(wrapper.find('input').element.value).to.equal('-');
    expect(wrapper.emitted().input).to.deep.equal([[0.0]]);

    // Trigger blur event
    await wrapper.find('input').trigger('blur');

    // Assert value is the default value but no new events were emitted
    expect(wrapper.find('input').element.value).to.equal('0.0');
    expect(wrapper.emitted().input).to.deep.equal([[0.0]]);
  });

  it('should allow input to be "." until blur', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { value: 5 }
    });

    // Set value to '.'
    wrapper.find('input').element.value = '.';
    await wrapper.find('input').trigger('input');

    // Assert value is '.' and input event was emitted with default value
    expect(wrapper.find('input').element.value).to.equal('.');
    expect(wrapper.emitted().input).to.deep.equal([[0.0]]);

    // Trigger blur event
    await wrapper.find('input').trigger('blur');

    // Assert value is the default value but no new events were emitted
    expect(wrapper.find('input').element.value).to.equal('0.0');
    expect(wrapper.emitted().input).to.deep.equal([[0.0]]);
  });

  it('default value should be the minimum if 0.0 is not valid', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { value: 3, max: 4, min: 2 }
    });

    // Set value to '' and trigger blur event so value must be updated
    wrapper.find('input').element.value = '';
    await wrapper.find('input').trigger('input');
    await wrapper.find('input').trigger('blur');

    // Assert value is 2 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('2.0');
    expect(wrapper.emitted().input).to.deep.equal([[2.0]]);
  });

  it('should not allow input to be below the minimum', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { min: 10, value: 20 }
    });

    // Try to set value to 9, which is below the minimum
    wrapper.find('input').element.value = '9.0';
    await wrapper.find('input').trigger('input');

    // Assert value is 10 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('10.0');
    expect(wrapper.emitted().input).to.deep.equal([[10.0]]);

    // Try to decrement value
    await wrapper.trigger('keydown', { key: 'ArrowDown' });

    // Assert value is still 10 and no new event were emitted
    expect(wrapper.find('input').element.value).to.equal('10.0');
    expect(wrapper.emitted().input).to.deep.equal([[10.0]]);
  });

  it('should not allow input to be above the maximum', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { max: 10 }
    });

    // Try to set value to 11, which is above the maximum
    wrapper.find('input').element.value = '11.0';
    await wrapper.find('input').trigger('input');

    // Assert value is 10 and input event was emitted
    expect(wrapper.find('input').element.value).to.equal('10.0');
    expect(wrapper.emitted().input).to.deep.equal([[10.0]]);

    // Try to increment value
    await wrapper.trigger('keydown', { key: 'ArrowUp' });

    // Assert value is still 10 and no new events were emitted
    expect(wrapper.find('input').element.value).to.equal('10.0');
    expect(wrapper.emitted().input).to.deep.equal([[10.0]]);
  });

  it('should format value according to digits prop', async () => {
    // Initialize component
    const wrapper = mount(DecimalInput, {
      propsData: { digits: 3 }
    });

    // Assert value is correctly formatted
    expect(wrapper.find('input').element.value).to.equal('0.000');
  });
});
