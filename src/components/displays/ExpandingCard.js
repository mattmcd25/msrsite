import React from 'react';
import { Cell, Card, CardTitle, CardText, Avatar, FontIcon } from 'react-md';

export default function ExpandingCard(props) {
    return (
        <Cell size={6}>
            <Card>
                <CardTitle expander title={props.title} subtitle={props.subtitle}
                           avatar={<Avatar icon={<FontIcon>{props.icon}</FontIcon>} suffix="amber"/>}/>
                <CardText expandable>
                    {props.children}
                </CardText>
            </Card>
        </Cell>
    );
}