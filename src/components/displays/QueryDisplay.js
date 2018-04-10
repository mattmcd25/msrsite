import React from 'react';
import { CONSTANTS } from "../../index";
import ChipListElement from './ChipListElement';
import PropListElement from "./PropListElement";
import CheckTableElement from './CheckTableElement';
import ExpandingCard from './ExpandingCard';

const searchCards = (props, skills, langs) => [
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
            <ChipListElement edit list={props.skills} acData={skills}
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
                <ChipListElement edit list={props.workSkills} acData={skills}
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
                               acData={langs} add={props.addLang} remove={props.removeLang}/>
        )
    }
];

export default function QueryDisplay(props) {
    let skills = CONSTANTS['Skill'].map(s => s.NAME);
    let langs = CONSTANTS['Language'].map(s => s.LANGUAGE);
    return searchCards(props, skills, langs).map(sc => <ExpandingCard key={sc.title} {...sc}/>);
}