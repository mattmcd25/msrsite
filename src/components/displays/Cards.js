import React from 'react';
import { Cell, Card, CardTitle, CardText, CardActions } from 'react-md';
import ChipListElement from './ChipListElement';
import PropListElement from './PropListElement';
import CheckTableElement from "./CheckTableElement";

export function BlankCard(props) {
    return (
        <Cell size={4}>
            <Card className="member-card">
                <CardTitle className="card-action-title" title={props.title} subtitle={props.subtitle}>
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

export function ChipListCard(props) {
    return (
        <BlankCard {...props}>
            <ChipListElement {...props}/>
        </BlankCard>
    );
}

export function PropListCard(props) {
    return (
        <BlankCard {...props}>
            <PropListElement {...props}/>
        </BlankCard>
    );
}

export function PropsAndChipsCard(props) {
    return (
        <BlankCard {...props}>
            <PropListElement {...props}/>
            <br/>{props.list.length > 0 ? <b>{props.listHeader+":"}</b> : false}<br/>
            <ChipListElement {...props}/>
        </BlankCard>
    );
}

export function CheckTableCard(props) {
    return (
        <BlankCard {...props}>
            <CheckTableElement {...props}/>
        </BlankCard>
    );
}