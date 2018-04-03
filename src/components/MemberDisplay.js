import React from 'react';
import ChipList from './displays/ChipList';
import PropsWithList from './displays/PropsWithList';
import Props from './displays/Props';
import { Grid } from 'react-md';

export default class MemberDisplay extends React.PureComponent {
    render() {
        return (
            <Grid className="member-display">
                {(() => {
                    let {ID, FIRSTNAME, SURNAME, ...props} = this.props.mem;
                    return (<Props edit={this.props.edit} title={FIRSTNAME + " " + SURNAME} data={props}/>)
                })()}

                <ChipList edit={this.props.edit} name="Skills" children={this.props.skills}/>

                {Object.keys(this.props.work).map(work => {
                    let {SKILLS, ...props} = this.props.work[work];
                    return (
                        <PropsWithList edit={this.props.edit} key={work} name={work} subtitle="Work Experience"
                                       list={SKILLS} data={props} listHeader="Skills Learned:"/>
                    );
                })}
            </Grid>
        );
    }
}