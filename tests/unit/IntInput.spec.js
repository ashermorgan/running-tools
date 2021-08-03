import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import IntInput from '@/components/IntInput.vue';

describe('IntInput.vue', () => {
  it('value should be 0 by default', () => {
    const wrapper = mount(IntInput);
    expect(wrapper.find('input').element.value).to.equal('0');
  });

  it('should read value prop', () => {
    const wrapper = mount(IntInput, {
      propsData: { value: 1 }
    });
    expect(wrapper.find('input').element.value).to.equal('1');
  });

  it('up arrow should increment value', async () => {
    const wrapper = mount(IntInput);
    await wrapper.trigger('keydown', { key: 'ArrowUp' });
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.deep.equal([[1]]);
  });

  it('down arrow should increment value', async () => {
    const wrapper = mount(IntInput, {
      propsData: { value: 2 }
    });
    await wrapper.trigger('keydown', { key: 'ArrowDown' });
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.deep.equal([[1]]);
  });

  it('should fire input event when value changes', async () => {
    const wrapper = mount(IntInput);
    await wrapper.trigger('keydown', { key: 'ArrowUp' });
    expect(wrapper.emitted().input).to.deep.equal([[1]]);
  });

  it('should accept numerical values', async () => {
    const wrapper = mount(IntInput);
    wrapper.find('input').element.value = '1';
    await wrapper.find('input').trigger('input');
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.deep.equal([[1]]);
  });

  it('should not accept non numerical values', async () => {
    const wrapper = mount(IntInput, {
      propsData: { value: 1 }
    });
    wrapper.find('input').element.value = 'a';
    await wrapper.find('input').trigger('input');
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.be.undefined;
  });

  it('should remove leading zeros', async () => {
    const wrapper = mount(IntInput, {
      propsData: { value: 1 }
    });
    wrapper.find('input').element.value = '01';
    await wrapper.find('input').trigger('input');
    expect(wrapper.find('input').element.value).to.equal('1');
    expect(wrapper.emitted().input).to.be.undefined;
  });

  it('should set empty input to 0', async () => {
    const wrapper = mount(IntInput, {
      propsData: { value: 1 }
    });
    wrapper.find('input').element.value = '';
    await wrapper.find('input').trigger('input');
    expect(wrapper.find('input').element.value).to.equal('0');
    expect(wrapper.emitted().input).to.deep.equal([[0]]);
  });

  it('should not allow input to be below the minimum', async () => {
    const wrapper = mount(IntInput, {
      propsData: { min: 10, value: 20 }
    });
    wrapper.find('input').element.value = '9';
    await wrapper.find('input').trigger('input');
    expect(wrapper.find('input').element.value).to.equal('10');
    expect(wrapper.emitted().input).to.deep.equal([[10]]);
  });

  it('should not allow input to be above the maximum', async () => {
    const wrapper = mount(IntInput, {
      propsData: { max: 10 }
    });
    wrapper.find('input').element.value = '11';
    await wrapper.find('input').trigger('input');
    expect(wrapper.find('input').element.value).to.equal('10');
    expect(wrapper.emitted().input).to.deep.equal([[10]]);
  });
});
