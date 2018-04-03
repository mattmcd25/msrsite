import {PrettyPair} from "./DisplayUtils";
import React from 'react';

export default class PropListElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    onChange = (evt) => {
        let tgt = evt.target;
        this.setState((prevstate) => {
            return {
                data: {...prevstate.data, [tgt.name]:tgt.value}
            };
        });
        this.props.onChange(evt);
    };

    render() {
        return (
            <div>
                {Object.keys(this.props.data).map((f, i, a) => {
                    return (
                        this.props.edit ?
                            <div key={i}>
                                <label>{f + ": "}</label>
                                <input value={this.state.data[f]} onChange={this.onChange}
                                       type="text" name={f}/>
                            </div> :
                            <label key={i}>{PrettyPair(f, this.props.data[f])}</label>
                    );
                })}
            </div>
        );
    }
}