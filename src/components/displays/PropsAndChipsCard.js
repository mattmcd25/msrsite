import React from 'react';
import { Cell, Card, CardTitle, CardText, CardActions } from 'react-md';
import PropListElement from './PropListElement';
import ChipListElement from './ChipListElement';

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
                    <PropListElement {...props} onChange={props.onChange}/>
                    <br/>{props.list.length > 0 ? <b>{props.listHeader+":"}</b> : false}<br/>
                    <ChipListElement {...props} updateList={props.updateList}/>
                </CardText>
            </Card>
        </Cell>
    );
}