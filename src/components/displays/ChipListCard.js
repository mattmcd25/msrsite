import React from 'react';
import { Cell, Card, CardTitle, CardText, CardActions } from 'react-md';
import ChipListElement from './ChipListElement';

export default function ChipListCard(props) {
    return (
        <Cell size={4}>
            <Card className="member-card">
                <CardTitle className="card-action-title" title={props.name} subtitle={props.subtitle}>
                    <CardActions>
                        {props.actions}
                    </CardActions>
                </CardTitle>
                <CardText>
                    <ChipListElement {...props}/>
                </CardText>
            </Card>
        </Cell>
    );
}