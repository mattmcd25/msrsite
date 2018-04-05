import React from 'react';
import { Cell, Card, CardTitle, CardText, CardActions } from 'react-md';

export default function PropsAndChipsCard(props) {
    return (
        <Cell size={4}>
            <Card className="member-card">
                <CardTitle className="card-action-title" title={props.name} subtitle={props.subtitle}>
                    <CardActions>
                        {props.actions}
                    </CardActions>
                </CardTitle>
                <CardText>
                    {props.children}
                </CardText>
            </Card>
        </Cell>
    );
}