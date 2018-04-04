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
            loading: true,
            nextID: 1
        };

    }

    // initial loading
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
                <Button className="blueText" raised secondary onClick={this.saveChanges}>
                    Save
                </Button>
                ]))
            .then(() => this.setState({ loading: false }));
    }

    // save changes to the member
    saveChanges = () => {
        this.setState({ loading: true });
        let allPromises = [];
        let ID = this.props.match.params.memid;
        let difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x));

        // Update basic member fields
        if(JSON.stringify(this.state.mem) !== JSON.stringify(this.state.pastMem)) {
            let {ID, ...restMem} = this.state.mem;
            allPromises.push(update('Member', {...restMem, PK: {ID: ID}}));
        }

        // Update other skills
        let oldSkills = this.state.pastSkills;
        let newSkills = this.state.skills;
        difference(oldSkills, newSkills).forEach(NAME => allPromises.push(del('Has_Skill', {ID, NAME}))); // removed skills
        difference(newSkills, oldSkills).forEach(NAME => allPromises.push(insert('Has_Skill', {ID, NAME}))); // added skills

        // Adding or removing work experiences altogether
        let newWorkPromises = [];
        let oldWork = Object.keys(this.state.pastWork);
        let newWork = Object.keys(this.state.work);
        difference(newWork, oldWork).forEach(workID => {
            let {WORKID, SKILLS, ...restWork} = this.state.work[workID];
            newWorkPromises.push(insert('Work', {
                ID,
                ...restWork
            }).then(res => {
                let newID = res.recordset[0].WORKID;
                let {[workID]:oldObject, ...workWithoutFakeID} = this.state.work;
                this.setState(prevState => ({
                    ...prevState,
                    work: {
                        ...workWithoutFakeID,
                        [newID]: {
                            ...oldObject,
                            WORKID: newID
                        }
                    },
                    pastWork: {
                        ...prevState.pastWork,
                        [newID]: {
                            ...oldObject,
                            WORKID: newID,
                            SKILLS: []
                        }
                    }
                }));
            }));
        });

        difference(oldWork, newWork).forEach(WORKID => {
            allPromises.push(del('Work_Skill', {WORKID})
                .then(() => del('Work', {WORKID})));
        });

        Promise.all(newWorkPromises).then(() => {
            Object.keys(this.state.work).forEach(workID => {
                console.log('past');
                console.log(this.state.pastWork);
                console.log('work');
                console.log(this.state.work);
                let {WORKID:pastID, SKILLS:oldSkills, ...restPast} = this.state.pastWork[workID];
                let {WORKID:curID, SKILLS:newSkills, ...restWork} = this.state.work[workID];
                difference(oldSkills, newSkills).forEach(NAME => allPromises.push(del('Work_skill', {WORKID: workID, NAME})));
                difference(newSkills, oldSkills).forEach(NAME => allPromises.push(insert('Work_skill', {WORKID: workID, NAME})));
                if(JSON.stringify(restWork) !== JSON.stringify(restPast))
                    allPromises.push(update('Work', {...restWork, PK: {WORKID: workID}}));
            });
        });

        Promise.all(allPromises).then(() => this.props.history.push('/member/'+ID));
    };

    // member text field edited
    updateMember = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState((prevstate) => {
            return {mem : {...prevstate.mem, [name]: value}}
        });
    };

    // work text field edited
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

    // skills list changed
    setSkills = (newSkills) => {
        this.setState({ skills: newSkills });
    };

    // work skills list changed
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

    // add work
    addWork = () => {
        let newID = 'new'+this.state.nextID;
        this.setState(prevState => ({
            work: {
                ...prevState.work,
                [newID]: {
                    WORKID: newID,
                    EMPLOYER: 'Untitled',
                    LENGTH: 0,
                    SKILLS: []
                }
            },
            nextID: prevState.nextID + 1
        }));
    };

    // remove work
    removeWork = (workID) => {
        let {[workID]:toDel, ...rest} = this.state.work;
        this.setState({
            work: rest
        });
    };

    removeMember = () => {
        // TODO add a confirm dialog lol
        this.setState({ loading: true });
        let ID = this.state.mem.ID;
        let promises = [];
        Object.keys(this.state.pastWork).forEach(WORKID => {
            promises.push(del('Work_Skill', {WORKID})
                .then(() => del('Work', {WORKID})));
        });

        this.state.skills.forEach(NAME => {
            promises.push(del('Has_Skill', {NAME, ID}));
        });

        Promise.all(promises)
            .then(() => del('Member', {ID}))
            .then(() => this.props.history.push('/'));
    };

    render() {
        return (
            <div className="editMemberPage">
                {
                    this.state.loading ?
                        <CircularProgress id="editMemberPage"/> :
                        <EditMemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}
                                           setSkills={this.setSkills} setWorkSkills={this.setWorkSkills}
                                           onMemChange={this.updateMember} onWorkChange={this.updateWork}
                                           addWork={this.addWork} removeWork={this.removeWork}
                                           removeMember={this.removeMember}/>
                }
            </div>
        );
    }
}