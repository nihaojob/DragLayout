import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import Buttons from '../components/attrs/DomButton/index.js';
import ButtonsJson from '../components/attrs/DomButton/attr.js';
import AttrPanel from '../components/attrs/panel.jsx';

class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <AttrPanel value={ButtonsJson} />
        <Buttons />
      </>
    );
  }
}

export default EditPage;
