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
            .then(work => this.setState({ work: PrettyWork(work), pastWork: PrettyWork(work) }))
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

        // Modify pre-existing work experience
        Object.keys(this.state.work).forEach((workName, i) => {
            let workid = this.state.work[workName].WORKID;
            let oldSkills = this.state.pastWork[workName].SKILLS;
            let newSkills = this.state.work[workName].SKILLS;
            diff(oldSkills, newSkills).forEach(sk => del('Work_skill', {WORKID:workid, NAME:sk}));
            diff(newSkills, oldSkills).forEach(sk => insert('Work_skill', {WORKID:workid, NAME:sk}));
            delete this.state.work[workName].WORKID;
            delete this.state.work[workName].SKILLS;
            update('Work', {...this.state.work[workName], PK: {WORKID:workid}});
        });

        // Adding or removing work experiences altogether
        let oldWork = Object.keys(this.state.pastWork).map(workName => this.state.pastWork[workName].WORKID);
        let newWork = Object.keys(this.state.work).map(workName => this.state.work[workName].WORKID);
        console.log(diff(oldWork, newWork)); // removed
        console.log(diff(newWork, oldWork)); // added
    };

    updateMember = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState((prevstate) => {
            return {mem : {...prevstate.mem, [name]: value}}
        });
    };

    updateWork = (workID, evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevstate => ({
            work : {
                ...prevstate.work,
                [workID]: {
                    ...prevstate.work[workID],
                    [name]: value
                }
            }
        }));
    };

    setSkills = (newSkills) => {
        this.setState({ skills: newSkills });
    };

    setWorkSkills = (workID, newSkills) => {
        this.setState(prevState => ({
            work: {
                ...prevState.work,
                [workID]: {
                    ...prevState.work[workID],
                    'SKILLS':newSkills
                }
            }
        }));
    };

    render() {
        return (
            <div className="editMemberPage">
                {
                    this.state.mem === undefined ?
                        <CircularProgress id="editMemberPage"/> :
                        <EditMemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}
                                           setSkills={this.setSkills} setWorkSkills={this.setWorkSkills}
                                           onMemChange={this.updateMember} onWorkChange={this.updateWork}/>
                }
            </div>
        );
    }
}