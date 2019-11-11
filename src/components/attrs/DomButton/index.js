import React, { Component } from 'react';
import { Button } from 'antd';
class Buttons extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <Button {...this.props} />
      </>
    );
  }
}

export default Buttons;
