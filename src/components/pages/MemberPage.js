import React from 'react';
import { getMemberByID, getMemberSkillsByID, getMemberWorkByID, getMemberLangsByID,
    getMemberCertsByID, getMemberPlacementsByID, getMemberTrainingByID } from "../../data/databaseManager";
import { Link } from 'react-router-dom';
import { Button, Grid, CircularProgress } from 'react-md';
import MemberDisplay from '../displays/MemberDisplay';
import {isAdmin} from "../../index";

export default class MemberPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        let id = this.props.match.params.memid;
        this.getAndSave(getMemberByID(id), 'mem')()
            .then(() => {
                if(this.state.mem === undefined) {
                    this.props.history.push('/');
                }
                else {
                    this.getAndSave(getMemberSkillsByID(id), 'skills')()
                        .then(this.getAndSave(getMemberWorkByID(id), 'work'))
                        .then(this.getAndSave(getMemberTrainingByID(id), 'training'))
                        .then(this.getAndSave(getMemberPlacementsByID(id), 'placement'))
                        .then(this.getAndSave(getMemberLangsByID(id), 'langs'))
                        .then(this.getAndSave(getMemberCertsByID(id), 'certs'))
                        .then(() => this.props.setTitle(this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
                        .then(() => isAdmin() && this.props.setActions((
                            <Link to={`/member/${this.state.mem.ID}/edit`}>
                                <Button style={{'color':'black'}} secondary raised>Edit</Button>
                            </Link>)))
                        .then(() => this.setState({ loading: false }));
                }
            });
    }

    getAndSave = (promise, name) =>
        () => promise.then(res => this.setState({ [name]:res }));

    render() {
        return (
            <div className="memberPage">
                {this.state.loading ?
                    <Grid className="member-display"><CircularProgress id="memberPage"/></Grid> :
                    <MemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}
                                   langs={this.state.langs} certs={this.state.certs} placement={this.state.placement}
                                   training={this.state.training}/>}
            </div>
        );
    }
}