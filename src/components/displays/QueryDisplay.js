import React from 'react';
import { Cell, Card, CardTitle, CardText, Avatar, FontIcon } from 'react-md';
import {CONSTANTS} from "../../index";
import ChipListElement from '../displays/ChipListElement';
import PropListElement from "./PropListElement";

const searchCards = (props) => [
    {
        title:'General Information',
        subtitle:'Search by name, address, member number, etc.',
        icon:'person',
        children: (
            <PropListElement edit data={props.general} onChange={props.onMemChange}/>
        )
    },
    {
        title:'Skills',
        subtitle:'Search for members with specific skills.',
        icon:'format_paint',
        children: (
            <ChipListElement edit list={props.skills} acData={CONSTANTS['Skill']}
                             name="Search Query" updateList={props.updateList}/>
        )
    },
    {
        title:'Work',
        subtitle:'Search for members with specific past work experience.',
        icon:'business',
        children: (
            <div>
                <PropListElement edit data={props.work} onChange={props.onWorkChange}/>
                <br/><b>Skills Learned:</b><br/>
                <ChipListElement edit list={props.workSkills} acData={CONSTANTS['Skill']}
                                 name="Search Query" updateList={props.updateWorkList}/>
            </div>
        )
    }
];

export default function QueryDisplay(props) {
    return searchCards(props).map(sc => <ExpandingSearchCard key={sc.title} {...sc}/>);
}

function ExpandingSearchCard(props) {
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