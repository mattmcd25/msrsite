import React from 'react';
import ChipListCard from './displays/ChipListCard';
import PropsAndChipsCard from './displays/PropsAndChipsCard';
import PropListCard from './displays/PropListCard';
import { Grid } from 'react-md';

export default class MemberDisplay extends React.PureComponent {
    render() {
        return (
            <Grid className="member-display">
                {(() => {
                    let {ID, FIRSTNAME, SURNAME, ...props} = this.props.mem;
                    return (<PropListCard title={FIRSTNAME + " " + SURNAME} data={props}/>)
                })()}

                <ChipListCard name="Skills"
                              list={this.props.skills} updateList={this.props.setSkills}/>

                {Object.keys(this.props.work).map(workID => {
                    let {WORKID, EMPLOYER, SKILLS, ...rest} = this.props.work[workID];
                    return (
                        <PropsAndChipsCard key={workID} name={EMPLOYER} subtitle="Work Experience"
                                           list={SKILLS} data={rest} listHeader="Skills Learned"/>
                    );
                })}
            </Grid>
        );
    }
}