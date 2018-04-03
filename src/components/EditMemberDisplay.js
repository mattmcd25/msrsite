import React from 'react';
import ChipList from './displays/ChipList';
import PropsWithList from './displays/PropsWithList';
import Props from './displays/Props';
import { Grid } from 'react-md';
import { CONSTANTS } from "../index";

export default class EditMemberDisplay extends React.PureComponent {
    render() {
        let skills = CONSTANTS['Skill'].map(s => s.NAME).filter(s => !this.props.skills.includes(s));

        return (
            <Grid className="member-display">
                {(() => {
                    let {ID, FIRSTNAME, SURNAME, ...props} = this.props.mem;
                    return (<Props edit title={FIRSTNAME + " " + SURNAME} data={props}/>)
                })()}

                {Object.keys(this.props.work).map(work => {
                    let {SKILLS, ...props} = this.props.work[work];
                    return (
                        <PropsWithList edit key={work} name={work} subtitle="Work Experience"
                                       list={SKILLS} data={props} listHeader="Skills Learned:"/>
                    );
                })}

                <ChipList edit name="Other Skills" acData={skills}
                          children={this.props.skills} updateList={this.props.setSkills}/>
            </Grid>
        );
    }
}