import React, { Component } from 'react';
import { Button } from 'antd';
import AttrItem from './oneItem';

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
        // console.log(value);
        this.updata(value)
        // const { data } = this.state;
        // this.setData({ data: Object.assign(data) });
    };

    render() {
        const { format, value } = this.props;
        console.log(format);
        
        return (
            <>
                {
                format &&
                    format.map(item => {
                        const NewValue = value[item.name];
                        return <AttrItem format={item} value={NewValue} onChange={this.getValue.bind(this)} />;
                    })}
            </>
        );
    }
}

export default AttrPanel;
