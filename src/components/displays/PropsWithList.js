import React from 'react';
import { Card, Chip, CardTitle, CardText } from 'react-md';

export default function MemberDisplay(props) {
    return (
        <Card className="chips__list">
            <CardTitle title={props.name} subtitle={props.subtitle}/>
            <CardText>
                {Object.keys(props.data).map((f, i, a) => {
                    return (f !== "ID") && (
                        <div key={i}>
                            <label>{f + ": " + props.data[f]}</label>
                            <br/>
                        </div>
                    );
                })}
            </CardText>
            {props.list.map(x => <Chip className="list_chip" key={x} label={x}/>)}
        </Card>
    );
}