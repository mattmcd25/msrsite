import React from 'react';
import { Cell, Card, CardTitle, CardText, CardActions } from 'react-md';
import ChipListElement from './ChipListElement';
import PropListElement from './PropListElement';
import CheckTableElement from "./CheckTableElement";

export function BlankCard(props) {
    return (
        <Cell size={4}>
            <Card className={`member-card ${props.className}`}>
                <CardTitle className="card-action-title" title={props.title} subtitle={props.subtitle}>
                    <CardActions>
                        {props.actions}
                    </CardActions>
                </CardTitle>
                <CardText>
                    {props.children}
                    {props.footer}
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
            <br/><b>{props.listHeader+":"}</b><br/>
            <ChipListElement {...props} acData={props.acData && props.acData.chips}/>
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