import React from 'react';
import { getMemberByID, getMemberSkillsByID, getMemberWorkByID } from "../../data/databaseManager";
import MemberDisplay from '../MemberDisplay';

export default class MemberPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mem: undefined
        };
    }

    componentDidMount() {
        let id = this.props.match.params.memid;
        getMemberSkillsByID(id)
            .then(skills => this.setState({ skills: skills }))
            .then(() => getMemberWorkByID(id))
            .then(work => this.setState({ work: this.makeFriendly(work) }))
            .then(() => getMemberByID(id))
            .then(mem => this.setState({ mem: mem }))
            .then(() => this.props.setTitle(this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
    }

    makeFriendly = (work) => {
        let x = work.reduce((acc, cur) => {
            if(acc!==undefined && acc.hasOwnProperty(cur.EMPLOYER)) {
                acc[cur.EMPLOYER].SKILLS.push(cur.NAME);
                return acc;
            }
            else {
                return {
                    [cur.EMPLOYER]: {
                        LENGTH: cur.LENGTH,
                        SKILLS: [cur.NAME]
                    },
                    ...acc
                }
            }
        }, {});
        console.log(x);
        return x;
    };

    render() {
        return (
            <div className="memberPage">
                {this.state.mem === undefined ?
                    <div>Loading<br/></div> :
                    <MemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}/>}
            </div>
        );
    }
}