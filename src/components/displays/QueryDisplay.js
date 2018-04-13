import React from 'react';
import { CONSTANTS } from "../../index";
import ChipListElement from './ChipListElement';
import PropListElement from "./PropListElement";
import CheckTableElement from './CheckTableElement';
import ExpandingCard from './ExpandingCard';
import { dictFromList } from "../../Utils";

let skills, langs, skDict, langDict;

const searchCards = (props) => [
    {
        title:'General Information',
        subtitle:'Search by name, address, member number, etc.',
        icon:'person',
        children: (
            <PropListElement edit data={props.general} onChange={props.onMemChange} table="Member"
                             acData={{SITE:CONSTANTS['Site'].map(s=>s.ABBR)}}/>
        )
    },
    {
        title:'Member Skills',
        subtitle:'Search for members with specific skills.',
        icon:'format_paint',
        children: (
            <ChipListElement edit list={props.skills} acData={skills} tips={skDict}
                             name="Search Query" updateList={props.updateList}/>
        )
    },
    {
        title:'Past Work Experience',
        subtitle:'Search for members with specific past work experience.',
        icon:'business',
        children: (
            <div>
                <PropListElement edit data={props.work} onChange={props.onWorkChange} table="Work"/>
                <br/><b>Skills Learned:</b><br/>
                <ChipListElement edit list={props.workSkills} acData={skills} tips={skDict}
                                 title="Search Query" updateList={props.updateWorkList}/>
            </div>
        )
    },
    {
        title:'Language Proficiency',
        subtitle:'Search for members with specific knowledge of languages.',
        icon:'language',
        children: (
            <CheckTableElement edit data={props.langs} onChange={props.setLangs} tips={langDict}
                               acData={langs} add={props.addLang} remove={props.removeLang}/>
        )
    },
    {
        title:'Certifications and Diplomas',
        subtitle:'Search for members with specific certifications.',
        icon:'school',
        children: (
            <PropListElement edit data={props.cert} onChange={props.onCertChange} table="Has_Cert"/>
        )
    }
];

export default function QueryDisplay(props) {
    skills = CONSTANTS['Skill'].map(s => s.NAME);
    langs = CONSTANTS['Language'].map(s => s.LANGUAGE);
    skDict = dictFromList(CONSTANTS['Skill'], 'NAME');
    langDict = dictFromList(CONSTANTS['Language'], 'LANGUAGE');
    return searchCards(props).map(sc => <ExpandingCard key={sc.title} {...sc}/>);
}