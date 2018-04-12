import {PrettyPair, PrettyKey, textValidation} from "./DisplayUtils";
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
                                <TextField
                                    id={field}
                                    name={field}
                                    label={PrettyKey(field)}
                                    fullWidth={false}
                                    value={this.state.data[field]}
                                    onChange={this.onChange}
                                    {...textValidation(this.props.table, field)}
                                />
                            </div> :
                            <label key={field}>{PrettyPair(field, this.props.data[field])}</label>
                    );
                })}
            </div>
        );
    }
}