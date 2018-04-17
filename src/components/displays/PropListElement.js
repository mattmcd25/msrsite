import {PrettyPair, PrettyKey, textValidation} from "./DisplayUtils";
import { TextField, Autocomplete, Checkbox, DatePicker } from 'react-md';
import React from 'react';
import {HEADERS} from "../../index";

export default class PropListElement extends React.Component {
    constructor(props) {
        super(props);
        if(props.edit) {
            let data = {...props.data};
            Object.keys(data).forEach(field => {
                if (HEADERS[this.props.table][field].DATA_TYPE === 'date') {
                    let d = new Date(data[field]);
                    d.setHours(12);
                    data[field] = d;
                }
            });
            this.state = {data};
            this.refs = {};
        }
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

    onChange = (name, value) => {
        if(value instanceof Date)
            value.setHours(12);
        this.setState((prevstate) => {
            return {
                data: {...prevstate.data, [name]:value}
            };
        });
        this.props.onChange({target:{name,value}});
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
                                                          this.onChange(field, '');
                                                      }
                                                  }} {...textValidation(this.props.table, field)} className="padRight"
                                                  onAutocomplete={val => this.onChange(field, val)}/>
                        }
                        else if (typeof(this.props.data[field]) === 'boolean') {
                            return <Checkbox key={field} id={field} name={field} label={PrettyKey(field)}
                                             checked={this.state.data[field]} onChange={v => this.onChange(field, v)}/>
                        }
                        else if (HEADERS[this.props.table][field].DATA_TYPE === 'date') {
                            return <DatePicker id={`${field}-date`} label={PrettyKey(field)} displayMode="portrait"
                                               value={this.state.data[field]} fullWidth={false} icon={false} autoOk
                                               onChange={(s, o) => this.onChange(field, o)} className='inlineDate'
                                               {...textValidation(this.props.table, field)} key={field} />;
                        }
                        else {
                            return <TextField className="padRight" key={field} id={field} name={field}
                                       label={PrettyKey(field)} fullWidth={false} value={this.state.data[field]}
                                       onChange={(v, e) => this.onChange(e.target.name, v)}
                                              {...textValidation(this.props.table, field)}/>
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