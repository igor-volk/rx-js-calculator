import React from 'react';
import { mount } from 'enzyme';

import Calculator from './Calculator';

describe('Calculator component', () => {
  let wrapper;
  beforeAll(() => {
    wrapper = mount(<Calculator />)
  });

  it('should render number keys', () => {
    expect(wrapper.find('.number').length).toEqual(12);
  });

  it('should render operator keys', () => {
    expect(wrapper.find('.operator').length).toEqual(5);
  });

  describe('input and output', () => {
    beforeEach(() => {
      wrapper = mount(<Calculator />);
    })

    it('should input values', () => {
      const key1 = wrapper.find('.number[children="1"]');
      const keyDot = wrapper.find('.number[children="."]');
      const key2 = wrapper.find('.number[children="2"]');

      key1.simulate("click");
      keyDot.simulate("click");
      key2.simulate("click");

      expect(wrapper.find('.input').text()).toEqual('1.2');
    });

    it('should calculate and display output values', () => {
      const key1 = wrapper.find('.number[children="1"]');
      const keyDot = wrapper.find('.number[children="."]');
      const key2 = wrapper.find('.number[children="2"]');
      const keyPlus = wrapper.find('.operator[children="+"]');
      const key5 = wrapper.find('.number[children="5"]');

      key1.simulate("click");
      keyDot.simulate("click");
      key2.simulate("click");
      keyPlus.simulate("click");
      key5.simulate("click");

      expect(wrapper.find('.input').text()).toEqual('1.2+5');
      expect(wrapper.find('.output').text()).toEqual('6.2');
    });

    it('should clear results of the calculation', () => {
      const key3 = wrapper.find('.number[children="3"]');
      const keyDot = wrapper.find('.number[children="."]');
      const key4 = wrapper.find('.number[children="4"]');
      const keyAC = wrapper.find('.operator[children="AC"]');

      key3.simulate("click");
      keyDot.simulate("click");
      key4.simulate("click");
      keyAC.simulate("click");

      expect(wrapper.find('.input').text()).toEqual('');
      expect(wrapper.find('.output').text()).toEqual('');
    });

  });
});
