import React from 'react';
import {CONSTANTS, WORKTYPE, WORKSTATUS, isAdmin} from "../../index";
import ChipListElement from './ChipListElement';
import PropListElement from "./PropListElement";
import CheckTableElement from './CheckTableElement';
import ExpandingCard from './ExpandingCard';
import { dictFromList } from "../../Utils";

let skills, langs, skDict, langDict;
let refs = {};

const searchCards = (props) => [
    {
        title:'General Information',
        subtitle: isAdmin() ? 'Search by name, address, member number, etc.' : 'Search by name or member number.',
        icon:'person',
        children: (
            <PropListElement edit data={props.general} onChange={e => props.update('mem', e)} table="Member"
                             acData={{SITE:CONSTANTS['Site'].map(s=>s.ABBR)}} ref={e => refs['mem']=e}/>
        )
    },
    {
        title:'Member Skills',
        subtitle:'Search for members with specific skills.',
        icon:'format_paint',
        children: (
            <ChipListElement edit list={props.skills} acData={skills} tips={skDict}
                             title="Search Query" updateList={li => props.updateList('skills', li)}/>
        )
    },
    {
        title:'Past Work Experience',
        subtitle:'Search for members with specific past work experience.',
        icon:'business',
        children: (
            <div>
                <PropListElement edit data={props.work} onChange={e => props.update('work', e)}
                                 table="Work" ref={e => refs['work']=e}/>
                <br/><b>Skills Learned:</b><br/>
                <ChipListElement edit list={props.workSkills} acData={skills} tips={skDict}
                                 title="Search Query" updateList={li => props.updateList('workSkills', li)}/>
            </div>
        )
    },
    {
        title:'Placements through MSR',
        subtitle:'Search for members that were placed by MSR with specific jobs.',
        icon:'phone',
        children: (
            <div>
                <PropListElement edit data={props.placement} onChange={e => props.update('placement', e)}
                                 table="Placement" acData={{WORKTYPE, WORKSTATUS}} ref={e => refs['placement']=e}/>
                <br/><b>Skills Learned:</b><br/>
                <ChipListElement edit list={props.placementSkills} acData={skills} tips={skDict}
                                 title="Search Query" updateList={li => props.updateList('placementSkills', li)}/>
            </div>
        )
    },
    {
        title:"MSR Training Sessions",
        subtitle:'Search for members that were trained by MSR in different fields.',
        icon:'assignment',
        children: (
            <div>
                <PropListElement edit data={props.training} onChange={e => props.update('training', e)}
                                 table="Training" acData={{SUCCEEDED:['True', 'False']}} ref={e => refs['training']=e}/>
                <br/><b>Skills Learned:</b><br/>
                <ChipListElement edit list={props.trainingSkills} acData={skills} tips={skDict}
                                 title="Search Query" updateList={li => props.updateList('trainingSkills', li)}/>
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
            <PropListElement edit data={props.cert} onChange={e => props.update('cert', e)} table="Has_Cert"
                             acData={{TYPE:CONSTANTS['Certificate'].map(c=>c.TYPE)}} ref={e => refs['cert']=e}/>
        )
    }
];

export default class QueryDisplay extends React.PureComponent {
    clearACs = () => {
        Object.values(refs).forEach(l => l && l.clearACs());
    };

    render() {
        skills = CONSTANTS['Skill'].map(s => s.NAME);
        langs = CONSTANTS['Language'].map(s => s.LANGUAGE);
        skDict = dictFromList(CONSTANTS['Skill'], 'NAME');
        langDict = dictFromList(CONSTANTS['Language'], 'LANGUAGE');
        return searchCards(this.props).map(sc => <ExpandingCard key={sc.title} {...sc}/>);
    }
}