import React from 'react';
import { Card, Cell, CardActions, CardTitle, CardText } from 'react-md';
import PropListElement from './PropListElement';

export default function PropsListCard(props) {
    return (
        <Cell size={4}>
            <Card className="member-card">
                <CardTitle className="card-action-title" title={props.title} subtitle={props.subtitle}>
                    <CardActions>
                        {props.actions}
                    </CardActions>
                </CardTitle>
                <CardText>
                    <PropListElement {...props}/>
                </CardText>
            </Card>
        </Cell>
    );
}