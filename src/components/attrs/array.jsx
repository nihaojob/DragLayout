import React, { Component } from 'react';
import { Button, Table } from 'antd';
class array extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { format, value, onChange } = this.props;
    return <>
      {format.name}
      <Button type="primary" shape="circle" icon="plus" />
      <Table dataSource={value} />
    </>;
  }
}

export default array;
