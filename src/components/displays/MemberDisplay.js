import React from 'react';
import { ChipListCard, PropsAndChipsCard, PropListCard, CheckTableCard } from "./Cards";
import { Grid } from 'react-md';

export default function MemberDisplay(props) {
    return (
        <Grid className="member-display">
            {(() => {
                let {ID, FIRSTNAME, SURNAME, ...rest} = props.mem;
                return (<PropListCard title={FIRSTNAME + " " + SURNAME} data={rest}/>)
            })()}

            <ChipListCard title="Skills" list={props.skills} updateList={props.setSkills}/>

            {Object.keys(props.work).map(workID => {
                let {WORKID, EMPLOYER, SKILLS, ...rest} = props.work[workID];
                return (
                    <PropsAndChipsCard key={workID} title={EMPLOYER} subtitle="Work Experience"
                                       list={SKILLS} data={rest} listHeader="Skills Learned"/>
                );
            })}

            <CheckTableCard title="Language Proficiencies" data={props.langs}/>
        </Grid>
    );
}