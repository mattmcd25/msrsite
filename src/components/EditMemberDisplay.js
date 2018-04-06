import React from 'react';
import { BlankCard, ChipListCard, PropsAndChipsCard, PropListCard, CheckTableCard } from "./displays/Cards";
import { Grid, Button } from 'react-md';
import { CONSTANTS } from "../index";

export default function EditMemberDisplay(props) {
    let skills = CONSTANTS['Skill'];
    return (
        <Grid className="member-display">
            {(() => {
                let {ID, ...rest} = props.mem;
                return (<PropListCard edit title={rest.FIRSTNAME + " " + rest.SURNAME} data={rest}
                                      onChange={props.onMemChange}/>)
            })()}

            {Object.keys(props.work).map(workID => {
                let {WORKID, SKILLS, ...rest} = props.work[workID];
                return (
                    <PropsAndChipsCard edit key={workID} title={rest.EMPLOYER} subtitle="Work Experience"
                                       list={SKILLS} data={rest} listHeader="Skills Learned"
                                       updateList={(list) => props.setWorkSkills(workID, list)} acData={skills}
                                       onChange={(evt) => props.onWorkChange(workID, evt)}
                                       actions={<Button raised className="redButton"
                                                        onClick={() => props.removeWork(workID)}>
                                                    Delete
                                                </Button>}/>
                );
            })}

            <ChipListCard edit name="Other Skills" acData={skills}
                          list={props.skills} updateList={props.setSkills}/>

            <CheckTableCard edit title="Language Proficiencies" data={props.langs}/>

            <BlankCard title="Other Actions">
                <Button raised primary onClick={props.addWork}>
                    Add Work Experience
                </Button>
                <label className="vertSpacer"/>
                <Button raised className="redButton" onClick={props.removeMember}>
                    Delete This Member
                </Button>
            </BlankCard>
        </Grid>
    );
}