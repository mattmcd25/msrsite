import React from 'react';
import { Chip, Autocomplete } from 'react-md';
import Tooltip from '../Tooltip';

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
                    <h5>None</h5> :
                    <div>{this.props.list.map(x => <BetterChip className="list_chip" key={x} tip={this.props.tips && this.props.tips[x].DESC}
                                                          label={x} removable={this.props.edit}
                                                              onRemove={this.remove}/>)}<br/></div>}
                {this.props.edit ?
                    <Autocomplete id="chips-autocomplete" label={`Add ${head}to ${this.props.title}`}
                                  data={this.props.acData.filter(s => !this.props.list.includes(s))}
                                  onAutocomplete={this.add} clearOnAutocomplete size={30} fullWidth={false}/> :
                    false
                }
            </div>
        );
    }
}

function BetterChip(props) {
    let {onRemove, ...rest} = props;
    let label = props.label.includes('(') && props.label[props.label.length - 1] === ')' ?
                    props.label.substring(0, props.label.lastIndexOf('(')-1) :
                    props.label;
    return (
        <Tooltip tooltipPosition="top" tooltipLabel={props.tip}>
            <Chip onClick={props.removable ? () => onRemove(rest.label) : undefined} {...rest} label={label}/>
        </Tooltip>
    );
}