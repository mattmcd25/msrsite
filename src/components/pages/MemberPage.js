import React from 'react';
import { getMemberByID, getMemberSkillsByID, getMemberWorkByID, getMemberLangsByID } from "../../data/databaseManager";
import { Link } from 'react-router-dom';
import { Button, Grid, CircularProgress } from 'react-md';
import { PrettyWork } from '../displays/DisplayUtils';
import MemberDisplay from '../displays/MemberDisplay';
import {dictFromList} from "../../Utils";

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
            .then(skills => this.setState({ skills }))
            .then(() => getMemberWorkByID(id))
            .then(work => this.setState({ work: PrettyWork(work) }))
            .then(() => getMemberLangsByID(id))
            .then(langs => this.setState({ langs: dictFromList(langs, 'LANGUAGE') }))
            .then(() => getMemberByID(id))
            .then(mem => this.setState({ mem }))
            .then(() => this.props.setTitle(this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
            .then(() => this.props.setActions((
                <Link to={`/member/${this.state.mem.ID}/edit`}>
                    <Button style={{'color':'black'}} secondary raised>Edit</Button>
                </Link>)));
    }

    render() {
        return (
            <div className="memberPage">
                {this.state.mem === undefined ?
                    <Grid className="member-display"><CircularProgress id="memberPage"/></Grid> :
                    <MemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}
                                   langs={this.state.langs}/>}
            </div>
        );
    }
}