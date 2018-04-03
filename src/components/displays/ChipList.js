import React from 'react';
import { Cell, Card, Chip, CardTitle, CardText, CardActions, Autocomplete } from 'react-md';

export default class ChipList extends React.PureComponent {
    remove = (value) => {
        let newList = this.props.children.slice();
        newList.splice(newList.indexOf(value), 1);
        this.props.updateList(newList);
    };

    add = (value) => {
        let newList = this.props.children.slice();
        newList.push(value);
        this.props.updateList(newList);
    };

    render() {
        return (
            <Cell size={4}>
                <Card className="member-card">
                    <CardTitle className="card-action-title" title={this.props.name} subtitle={this.props.subtitle}>
                        <CardActions>
                            {this.props.actions}
                        </CardActions>
                    </CardTitle>
                    <CardText>
                        {this.props.children.map(x => <BetterChip className="list_chip" key={x}
                                                       label={x} removable={this.props.edit}
                                                       onRemove={this.remove}/>)}
                        {this.props.edit ?
                            <Autocomplete
                                id="chips-autocomplete"
                                label={`Add ${this.props.name}`}
                                data={this.props.acData}
                                onAutocomplete={this.add}
                                clearOnAutocomplete
                            /> :
                            false
                        }
                    </CardText>
                </Card>
            </Cell>
        );
    }
}

function BetterChip(props) {
    let {onRemove, ...rest} = props;
    return (
        <Chip onClick={props.removable ? () => onRemove(rest.label) : undefined} {...rest}/>
    );
}