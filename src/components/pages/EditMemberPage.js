import React from 'react';
import {getMemberByID, getMemberSkillsByID, getMemberWorkByID, update, del, insert} from "../../data/databaseManager";
import { Link } from 'react-router-dom'
import { Button, CircularProgress } from 'react-md';
import { PrettyWork } from "../displays/DisplayUtils";
import EditMemberDisplay from '../EditMemberDisplay';

export default class EditMemberPage extends React.Component {
    constructor(props){
        super(props);
        props.setActions([]);
        this.state = {
            mem: undefined,
        };

    }

    componentDidMount(){
        let id = this.props.match.params.memid;
        getMemberSkillsByID(id, false)
            .then(skills => this.setState({ skills: skills, pastSkills: skills }))
            .then(() => getMemberWorkByID(id))
            .then(work => this.setState({ work: PrettyWork(work), pastWork: work }))
            .then(() => getMemberByID(id))
            .then(mem => this.setState({ mem: mem, pastMem: mem }))
            .then(() => this.props.setTitle("Editing " + this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
            .then(() => this.props.setActions([
                <Link to={`/member/${id}`}>
                    <Button raised secondary children="Cancel" />
                </Link>,
                <label className="spacer"/>,
                <Link to={`/member/${id}`}>
                    <Button raised secondary onClick={this.saveChanges}>
                        Save
                    </Button>
                </Link>]));
    }

    saveChanges = (evt) => {
        let id = this.props.match.params.memid;
        let diff = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

        // Update basic member fields
        delete this.state.mem.ID;
        update('Member', {...this.state.mem, PK: {ID: id}});

        // Update skills
        let oldSkills = this.state.pastSkills;
        let newSkills = this.state.skills;
        diff(oldSkills, newSkills).forEach(sk => del('Has_Skill', {ID:id, NAME:sk})); // removed skills
        diff(newSkills, oldSkills).forEach(sk => insert('Has_Skill', {ID:id, NAME:sk})); // added skills

        // Update work experience
    };

    updateInputValue = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState((prevstate) => {
            return {mem : {...prevstate.mem, [name]: value}}
        });
    };

    setSkills = (newSkills) => {
        this.setState({ skills: newSkills });
    };

    render() {
        return (
            <div className="editMemberPage">
                {
                    this.state.mem === undefined ?
                        <CircularProgress id="editMemberPage"/> :
                        <EditMemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}
                                        setSkills={this.setSkills}/>
                }
            </div>
        );
    }
}