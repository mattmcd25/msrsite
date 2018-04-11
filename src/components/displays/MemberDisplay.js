import React from 'react';
import { ChipListCard, PropsAndChipsCard, PropListCard, CheckTableCard } from "./Cards";
import { Grid } from 'react-md';
import {CONSTANTS} from "../../index";
import {dictFromList} from "../../Utils";

export default function MemberDisplay(props) {
    let skDict = dictFromList(CONSTANTS['Skill'], 'NAME');
    let langDict = dictFromList(CONSTANTS['Language'], 'LANGUAGE');
    return (
        <Grid className="member-display">
            {(() => {
                let {ID, FIRSTNAME, SURNAME, ...rest} = props.mem;
                return (<PropListCard title={FIRSTNAME + " " + SURNAME} data={rest}/>)
            })()}

            <ChipListCard title="Skills" list={props.skills} updateList={props.setSkills} tips={skDict}/>

            {Object.keys(props.work).map(workID => {
                let {WORKID, EMPLOYER, SKILLS, ...rest} = props.work[workID];
                return (
                    <PropsAndChipsCard key={workID} title={EMPLOYER} subtitle="Work Experience" tips={skDict}
                                       list={SKILLS} data={rest} listHeader="Skills Learned"/>
                );
            })}

            {props.certs.map(cert => {
                let {ID, TYPE, ...rest} = cert;
                let DESC = dictFromList(CONSTANTS['Certificate'], 'TYPE')[TYPE].DESC;
                return <PropListCard title={TYPE} subtitle="Certificate" data={{DESC, ...rest}}/>
            })}

            <CheckTableCard title="Language Proficiencies" data={props.langs} tips={langDict}/>
        </Grid>
    );
}