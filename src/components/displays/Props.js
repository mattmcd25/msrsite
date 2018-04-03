import React from 'react';
import { Card, Cell, CardActions, CardTitle, CardText } from 'react-md';
import { PrettyPair } from './DisplayUtils';

export default function Props(props) {
    return (
        <Cell size={4}>
            <Card className="member-card">
                <CardTitle className="card-action-title" title={props.title} subtitle={props.subtitle}>
                    <CardActions>
                        {props.actions}
                    </CardActions>
                </CardTitle>
                <CardText>
                    {Object.keys(props.data).map((f, i, a) => {
                        return (
                            <label key={i}>{PrettyPair(f, props.data[f])}</label>
                        );
                    })}
                </CardText>
            </Card>
        </Cell>
    );
}