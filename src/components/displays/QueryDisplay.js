import React from 'react';
import { Cell, Card, CardTitle, CardText, Avatar, FontIcon } from 'react-md';
import {CONSTANTS} from "../../index";
import ChipListElement from './ChipListElement';
import PropListElement from "./PropListElement";
import CheckTableElement from './CheckTableElement';

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
        title:'Member Skills',
        subtitle:'Search for members with specific skills.',
        icon:'format_paint',
        children: (
            <ChipListElement edit list={props.skills} acData={CONSTANTS['Skill']}
                             name="Search Query" updateList={props.updateList}/>
        )
    },
    {
        title:'Past Work Experience',
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
    },
    {
        title:'Language Proficiency',
        subtitle:'Search for members with specific knowledge of languages.',
        icon:'language',
        children: (
            <CheckTableElement edit data={props.langs} onChange={props.setLangs}
                               acData={CONSTANTS['Language']} add={props.addLang} remove={props.removeLang}/>
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