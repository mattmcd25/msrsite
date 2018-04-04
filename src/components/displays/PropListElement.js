import { PrettyPair, PrettyKey } from "./DisplayUtils";
import { TextField } from 'react-md';
import React from 'react';

export default class PropListElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    onChange = (value, evt) => {
        let tgt = evt.target;
        this.setState((prevstate) => {
            return {
                data: {...prevstate.data, [tgt.name]:value}
            };
        });
        this.props.onChange(evt);
    };

    render() {
        return (
            <div>
                {Object.keys(this.props.data).map(field => {
                    return (
                        this.props.edit ?
                            <div key={field}>
                                {/*<label>{PrettyKey(field) + ": "}</label>*/}
                                {/*<input value={this.state.data[field]} onChange={this.onChange}*/}
                                       {/*type="text" name={field}/>*/}
                                <TextField
                                    id={field}
                                    name={field}
                                    label={PrettyKey(field)}
                                    // size={25}
                                    // fullWidth={false}
                                    value={this.state.data[field]}
                                    onChange={this.onChange}
                                    type="text"
                                />
                            </div> :
                            <label key={field}>{PrettyPair(field, this.props.data[field])}</label>
                    );
                })}
            </div>
        );
    }
}