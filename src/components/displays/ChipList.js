import React from 'react';
import { Cell, Card, Chip, CardTitle, CardText, CardActions } from 'react-md';

export default class ChipList extends React.PureComponent {
    remove = (e) => {
        console.log('delete me');
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
                        {this.props.children.map(x => <Chip className="list_chip" key={x}
                                                       label={x} removable={this.props.edit}
                                                       onClick={this.props.edit ? this.remove : undefined}/>)}
                    </CardText>
                </Card>
            </Cell>
        );
    }
}