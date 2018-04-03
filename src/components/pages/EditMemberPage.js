import React from 'react';
import {getMemberByID, getMemberSkillsByID, getMemberWorkByID, update} from "../../data/databaseManager";
import { Link } from 'react-router-dom'
import { Button, CircularProgress } from 'react-md';
import { PrettyWork } from "../displays/DisplayUtils";
import MemberDisplay from '../MemberDisplay';

export default class EditMemberPage extends React.Component {
    constructor(props){
        super(props);
        props.setActions([]);
        this.state = {
            mem: undefined
        };

    }

    componentDidMount(){
        let id = this.props.match.params.memid;
        getMemberSkillsByID(id)
            .then(skills => this.setState({ skills: skills }))
            .then(() => getMemberWorkByID(id))
            .then(work => this.setState({ work: PrettyWork(work) }))
            .then(() => getMemberByID(id))
            .then(mem => this.setState({ mem: mem }))
            .then(() => this.props.setTitle("Editing " + this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
            .then(() => this.props.setActions([
                <Link to={`/member/${id}`}>
                    <Button raised secondary onClick={() => {

                    }}>
                        Cancel
                    </Button>
                </Link>,
                <Link to={`/member/${id}`}>
                    <Button raised secondary onClick={() => {
                        delete this.state.mem.ID;
                        update('Member', {...this.state.mem, PK: {id: id}});
                    }}>
                        Save
                    </Button>
                </Link>]));
    }

    updateInputValue = (evt) =>{
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState((prevstate) => {
            return {mem : {...prevstate.mem, [name]: value}}
        });
    };

    render() {
        return (
            <div className="editMemberPage">
                {
                    this.state.mem === undefined ?
                        <CircularProgress id="editMemberPage"/> :
                        <MemberDisplay edit mem={this.state.mem} skills={this.state.skills} work={this.state.work} />
                }
            </div>
        );
    }
}