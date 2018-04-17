import React from 'react';
import { ChipListCard, PropsAndChipsCard, PropListCard, CheckTableCard } from "./Cards";
import { Grid } from 'react-md';
import {CONSTANTS} from "../../index";
import {dictFromList} from "../../Utils";

let skDict;
let langDict;

export default function MemberDisplay(props) {
    skDict = dictFromList(CONSTANTS['Skill'], 'NAME');
    langDict = dictFromList(CONSTANTS['Language'], 'LANGUAGE');
    return (
        <Grid className="member-display">
            {(() => {
                let {ID, FIRSTNAME, SURNAME, ...rest} = props.mem;
                return (<PropListCard title={FIRSTNAME + " " + SURNAME} data={rest}/>)
            })()}

            <ChipListCard title="Skills" list={props.skills} updateList={props.setSkills} tips={skDict}/>

            {jobCards(props.work, 'WORKID', 'Past Work Experience')}

            {jobCards(props.placement, 'PLACEMENTID', 'Placement through MSR')}

            {jobCards(props.training, 'TRAININGID', 'MSR Training Session', 'FIELD')}

            {Object.keys(props.certs).map(cert => {
                let {ID, TYPE, ...rest} = props.certs[cert];
                let DESC = dictFromList(CONSTANTS['Certificate'], 'TYPE')[TYPE].DESC;
                return <PropListCard title={TYPE} key={TYPE} subtitle="Certificate" data={{DESC, ...rest}}/>
            })}

            <CheckTableCard title="Language Proficiencies" data={props.langs} tips={langDict}/>
        </Grid>
    );
}

function jobCards(list, pk, subtitle, title='EMPLOYER') {
    return Object.keys(list).map(key => {
        let {[pk]:id, [title]:t, SKILLS, ...rest} = list[key];
        return (
            <PropsAndChipsCard key={key} title={t} subtitle={subtitle} tips={skDict}
                               list={SKILLS} data={rest} listHeader="Skills Learned"/>
        )
    })
}