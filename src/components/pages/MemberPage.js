import React from 'react';
import { getMemberByID, getMemberSkillsByID, getMemberWorkByID } from "../../data/databaseManager";
import { Link } from 'react-router-dom';
import { Button, CircularProgress } from 'react-md';
import { PrettyWork } from '../displays/DisplayUtils';
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
            .then(work => this.setState({ work: PrettyWork(work) }))
            .then(() => getMemberByID(id))
            .then(mem => this.setState({ mem: mem }))
            .then(() => this.props.setTitle(this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
            .then(() => this.props.setActions((
                <Link to={`/member/${this.state.mem.ID}/edit`}>
                    <Button secondary raised>Edit</Button>
                </Link>)));
    }

    render() {
        return (
            <div className="memberPage">
                {this.state.mem === undefined ?
                    <CircularProgress id="memberPage"/> :
                    <MemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}/>}
            </div>
        );
    }
}