import React from 'react';
import { Card, Chip, CardTitle } from 'react-md';

export default function MemberDisplay(props) {
    return (
        <Card className="chips__list">
            <CardTitle title={props.name} subtitle={props.subtitle}/>
            {props.children.map(x => <Chip className="list_chip" key={x} label={x}/>)}
        </Card>
    );
}