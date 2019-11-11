import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';
import ButtonsJson from '../components/attrs/DomButton/attr.js';
import AttrPanel from '../components/attrs/index.js';

class EditPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  attrChange = value => {
      console.log(value);
  }

  render() {
    return (
      <>
            <AttrPanel format={ButtonsJson.attrs} value={ButtonsJson.attrsValue} onChange={this.attrChange.bind(this)} />
      </>
    );
  }
}

export default EditPage;
