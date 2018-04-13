import {PrettyPair, PrettyKey, textValidation} from "./DisplayUtils";
import { TextField, Autocomplete } from 'react-md';
import React from 'react';

export default class PropListElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
        this.refs = {};
    }

    setRef = (field, element) => {
        this.refs = {
            ...this.refs,
            [field]: element
        };
    };

    getRef = (field) => {
        return this.refs[field];
    };

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
                    if(this.props.edit) {
                        if(this.props.acData && this.props.acData[field]) {
                            return <Autocomplete id="props-autocomplete" label={PrettyKey(field)} ref={e => this.setRef(field, e)}
                                                  data={this.props.acData[field]} fullWidth={false} key={field} defaultValue={this.state.data[field]}
                                                  onBlur={() => {
                                                      let self = this.getRef(field);
                                                      let value = self.state.value;
                                                      let data = this.props.acData[field];
                                                      if(!data.includes(value)) {
                                                          self.setState({value:''});
                                                          this.onChange('', {target:{name:field,value:''}});
                                                      }
                                                  }} {...textValidation(this.props.table, field)}
                                                  onAutocomplete={val => this.onChange(val, {target:{name:field,value:val}})}/>
                        }
                        else {
                            return <TextField className="padRight" key={field} id={field} name={field}
                                       label={PrettyKey(field)} fullWidth={false} value={this.state.data[field]}
                                       onChange={this.onChange} {...textValidation(this.props.table, field)}/>
                        }
                    }
                    else {
                        return <label key={field}>{PrettyPair(field, this.props.data[field])}</label>;
                    }
                })}
            </div>
        );
    }
}