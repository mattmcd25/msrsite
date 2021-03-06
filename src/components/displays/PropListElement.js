import {PrettyPair, PrettyKey, textValidation} from "./DisplayUtils";
import { TextField, Autocomplete, Checkbox, DatePicker, SelectField } from 'react-md';
import React from 'react';
import {HEADERS} from "../../index";

export default class PropListElement extends React.Component {
    constructor(props) {
        super(props);
        this.refs = {};
    }

    setRef = (field, element) => {
        this.refs = {
            ...this.refs,
            [field]: element
        };
    };

    clearACs = () => {
        Object.values(this.refs).forEach(ac => ac.setState({value:''}));
    };

    getRef = (field) => {
        return this.refs[field];
    };

    onChange = (name, value) => {
        if(value instanceof Date)
            value.setHours(12);
        this.props.onChange({target:{name,value}});
    };

    render() {
        return (
            <div>
                {Object.keys(this.props.data).map(field => {
                    let fieldkey = (field.slice(0,3) === 'MIN' || field.slice(0,3) === 'MAX') ? field.slice(3) : field;

                    if(this.props.edit) {
                        if(this.props.acData && this.props.acData[field]) {
                            let wid = HEADERS[this.props.table][fieldkey].CHARACTER_MAXIMUM_LENGTH >= 40;
                            if(this.props.acData[field].length > 20) {
                                return <Autocomplete id="props-autocomplete" label={PrettyKey(field)} ref={e => this.setRef(field, e)}
                                                     data={this.props.acData[field]} fullWidth={wid} key={field} defaultValue={this.props.data[field]}
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
                            else {
                                let className = "md-cell md-cell--6 padRight";
                                if(!wid) className += ' fieldWidth';
                                else className += ' fieldDouble';
                                return <SelectField id="select-field-props" label={PrettyKey(field)} fullWidth={wid}
                                                    key={field} menuItems={this.props.acData[field]} sameWidth
                                                    defaultValue={this.props.data[field]} className={className}
                                                    {...textValidation(this.props.table, field)}
                                                    onChange={val => this.onChange(field, val)}/>;
                            }
                        }
                        else if (typeof(this.props.data[field]) === 'boolean') {
                            return <Checkbox key={field} id={field} name={field} label={PrettyKey(field)}
                                             className="padRight" checked={this.props.data[field]}
                                             onChange={v => this.onChange(field, v)}/>
                        }
                        else if (HEADERS[this.props.table][fieldkey].DATA_TYPE === 'date') {
                            let value = {};
                            if(this.props.data[field]) {
                                let d = new Date(this.props.data[field]);
                                d.setHours(12);
                                value = { value:d };
                            }
                            return <DatePicker id={`${field}-date`} label={PrettyKey(field)} displayMode="portrait"
                                               {...value} fullWidth={false} icon={false} autoOk key={field}
                                               onChange={(s, o) => this.onChange(field, o)} className='inlineDate'
                                               {...textValidation(this.props.table, fieldkey)}  />;
                        }
                        else {
                            let len = HEADERS[this.props.table][fieldkey].CHARACTER_MAXIMUM_LENGTH;
                            let rows = (len > 100) ? 3 : undefined;
                            return <TextField className="padRight" key={field} id={field} name={field} rows={rows}
                                                  label={PrettyKey(field)} fullWidth={false} value={this.props.data[field]}
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