import React from 'react';
import { Chip, Autocomplete } from 'react-md';

export default class ChipListElement extends React.Component {
    remove = (value) => {
        let newList = this.props.list.slice();
        newList.splice(newList.indexOf(value), 1);
        this.props.updateList(newList);
    };

    add = (value) => {
        let newList = this.props.list.slice();
        newList.push(value);
        this.props.updateList(newList);
    };

    render() {
        let head = this.props.listHeader ? (this.props.listHeader+" ") : "";

        return (
            <div>
                {this.props.list.length===0 ?
                    <p>None</p> :
                    <div>{this.props.list.map(x => <BetterChip className="list_chip" key={x}
                                                          label={x} removable={this.props.edit}
                                                              onRemove={this.remove}/>)}<br/></div>}
                {this.props.edit ?
                    <Autocomplete
                        id="chips-autocomplete"
                        label={`Add ${head}to ${this.props.name}`}
                        data={this.props.acData.filter(s => !this.props.list.includes(s))}
                        onAutocomplete={this.add}
                        clearOnAutocomplete
                        size={30} fullWidth={false}
                    /> :
                    false
                }
            </div>
        );
    }
}

function BetterChip(props) {
    let {onRemove, ...rest} = props;
    return (
        <Chip onClick={props.removable ? () => onRemove(rest.label) : undefined} {...rest}/>
    );
}