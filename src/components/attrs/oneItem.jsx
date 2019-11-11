import React, { Component } from 'react';
import { Button } from 'antd';
import  TypeItem from './type_item';

class AttrPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  // updata = value => {
  //   this.props.onChange(value);
  // };

  // getValue = value => {
  //     console.log(value);
      
  //   // const { data } = this.state;
  //   // this.setData({ data: Object.assign(data) });
  // };

  render() {
    const { format, value } = this.props;
    const TypeInfo = TypeItem[format.type];
    return (
      <>
        <TypeInfo format={format} value={value} onChange={this.props.onChange.bind(this)} />
      </>
    );
  }
}

export default AttrPanel;
