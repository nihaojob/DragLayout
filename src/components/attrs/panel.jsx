import React, { Component } from 'react';
import { Button } from 'antd';
import types from './item.js';

class AttrPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  updata = value => {
    this.props.onChange(value);
  };

  getValue = value => {
    const { data } = this.state;
    this.setData({ data: Object.assign(data) });
  };

  render() {
    const { attrs, attrsValue } = this.props.value;
    return (
      <>
        {attrs &&
          attrs.map(item => {
            const TypeInfo = types[item.type];
            const value = attrsValue[item.name];
            return <TypeInfo value={value} onChange={this.getValue.bind(this)} />;
          })}
      </>
    );
  }
}

export default AttrPanel;
