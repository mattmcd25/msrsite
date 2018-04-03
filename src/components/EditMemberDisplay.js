import React from 'react';
import ChipListCard from './displays/ChipListCard';
import PropsAndChipsCard from './displays/PropsAndChipsCard';
import PropListCard from './displays/PropListCard';
import { Grid } from 'react-md';
import { CONSTANTS } from "../index";

export default function EditMemberDisplay(props) {
    let skills = CONSTANTS['Skill'].map(s => s.NAME);

    return (
        <Grid className="member-display">
            {(() => {
                let {ID, ...rest} = props.mem;
                return (<PropListCard edit title={rest.FIRSTNAME + " " + rest.SURNAME} data={rest}
                                      onChange={props.onMemChange}/>)
            })()}

            {Object.keys(props.work).map(work => {
                let {WORKID, SKILLS, ...rest} = props.work[work];
                return (
                    <PropsAndChipsCard edit key={work} name={work} subtitle="Work Experience"
                                       list={SKILLS} data={rest} listHeader="Skills Learned:"
                                       updateList={(list) => props.setWorkSkills(work, list)} acData={skills}
                                       onChange={(evt) => props.onWorkChange(work, evt)}/>
                );
            })}

            <ChipListCard edit name="Other Skills" acData={skills}
                          list={props.skills} updateList={props.setSkills}/>
        </Grid>
    );
}