import React from 'react';
import {
    getMemberByID, getMemberSkillsByID, getMemberWorkByID,
    update, del, insert, getMemberLangsByID, getMemberCertsByID, getMemberTrainingByID, getMemberPlacementsByID
} from "../../data/databaseManager";
import { Link } from 'react-router-dom'
import { Button, Grid, CircularProgress } from 'react-md';
import { dataLengthIssues } from "../displays/DisplayUtils";
import EditMemberDisplay from '../displays/EditMemberDisplay';
import {intersection, difference, duplicates, capitalize, jsonEq} from "../../Utils";
import { TODAY } from "../../index";
import IssueButton from '../IssueButton';

export const defaultFor = (set, key) => {
    switch(set) {
        case 'work': return { WORKID:key, EMPLOYER: 'Untitled Work Experience', LENGTH: 0, SKILLS: [] };
        case 'placement': return { PLACEMENTID: key, EMPLOYER: 'Untitled Placement', WORKTYPE: 'Full-time',
                                    WORKSTATUS: 'Employed', STARTDATE: TODAY, SKILLS: [] };
        case 'training': return { TRAININGID: key, FIELD: 'Untitled Training', COMPLETEDATE: TODAY,
                                    SUCCEEDED: true, SKILLS: [] };
        case 'cert': return { TYPE:key, YEAR:2018, INSTITUTION:'' };
        default: return { key };
    }
};

export default class EditMemberPage extends React.Component {
    constructor(props){
        super(props);
        props.setActions([]);
        this.state = {
            loading: true,
            issues: [],
            nextID: 1
        };
    }

    // Generates and updates the actions in the top bar
    updateActions = () => {
        this.props.setActions([
            <Link to={`/member/${this.props.match.params.memid}`}>
                <Button style={{'color':'black'}} raised secondary children="Cancel" />
            </Link>,
            <label className="spacer"/>,
            <IssueButton raised secondary issues={this.state.issues} onClick={this.saveChanges}
                         style={{'color':'black'}} position="left">
                Save
            </IssueButton>
        ]);
    };

    // When state changes; used to update actions based on invalid data
    componentDidUpdate = () => {
        let issues = dataLengthIssues([this.state.mem], 'Member')
                        .concat(dataLengthIssues(this.state.work, 'Work'))
                        .concat(dataLengthIssues(this.state.certs, 'Has_Cert'))
                        .concat(dataLengthIssues(this.state.placement, 'Placement'))
                        .concat(dataLengthIssues(this.state.training, 'Training'));
        if(this.state.mem !== undefined) {
            if(!this.state.mem.SITE || this.state.mem.SITE === '') issues.push({field:'SITE',value:''});
            if(!this.state.mem.STATUS || this.state.mem.STATUS === '') issues.push({field:'STATUS',value:''});
        }
        if(this.state.certs) {
            let types = Object.values(this.state.certs).map(c=>c.TYPE);
            if(types.includes('')) issues.push({field:'TYPE',value:''});
            let dups = duplicates(types);
            if(dups.length > 0) issues.push({field:'TYPE',value:dups[0],duplicate:true});
        }
        if(!jsonEq(issues[0], this.state.issues[0])) {
            this.setState({ issues }, this.updateActions);
        }
    };

    // Initial loading from database
    componentDidMount(){
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
                        .then(() => this.props.setTitle("Editing " + this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
                        .then(this.updateActions)
                        .then(() => this.setState({ loading: false }));
                }
            });
    }

    past = (name) => `past${capitalize(name)}`;

    getAndSave = (promise, name) =>
        () => promise.then(res => this.setState({ [name]:res, [this.past(name)]:res }));

    // Save changes to the member
    saveChanges = () => {
        this.setState({ loading: true });
        this.props.toast({text:'Saving changes...'});

        let promises = [];
        let ID = this.props.match.params.memid;

        // Update basic member fields
        if(!jsonEq(this.state.mem, this.state.pastMem)) {
            let {ID, ...restMem} = this.state.mem;
            promises.push(update('Member', {...restMem, PK: {ID}}));
        }

        // Update other skills
        let oldSkills = this.state.pastSkills;
        let newSkills = this.state.skills;
        difference(oldSkills, newSkills).forEach(NAME => promises.push(del('Has_Skill', {ID, NAME}))); // removed skills
        difference(newSkills, oldSkills).forEach(NAME => promises.push(insert('Has_Skill', {ID, NAME}))); // added skills

        // Update langauges
        let oldLangs = Object.keys(this.state.pastLangs);
        let newLangs = Object.keys(this.state.langs);
        difference(oldLangs, newLangs).forEach(lang => promises.push(del('Know_lang', this.state.pastLangs[lang])));
        difference(newLangs, oldLangs).forEach(lang => promises.push(insert('Know_lang', this.state.langs[lang])));
        intersection(newLangs, oldLangs).forEach(langName => {
            let {ID, LANGUAGE, ...restNew} = this.state.langs[langName];
            let {ID:oldID, LANGUAGE:oldLang, ...restOld} = this.state.pastLangs[langName];
            if(!jsonEq(restNew, restOld)) {
                promises.push(update('Know_lang', {
                    ...restNew,
                    PK: {ID, LANGUAGE}
                }));
            }
        });

        // Update certificates
        let oldCerts = Object.keys(this.state.pastCerts);
        let newCerts = Object.keys(this.state.certs);
        difference(newCerts, oldCerts).forEach(cert => promises.push(insert('Has_Cert', this.state.certs[cert])));
        difference(oldCerts, newCerts).forEach(cert => promises.push(del('Has_Cert', this.state.pastCerts[cert])));
        intersection(oldCerts, newCerts).forEach(cert => {
            let {ID, TYPE, ...restNew} = this.state.certs[cert];
            let {ID:oldID, TYPE:oldType, ...restOld} = this.state.pastCerts[cert];
            if(!jsonEq({TYPE, ...restNew}, {TYPE:oldType, ...restOld})) {
                promises.push(update('Has_Cert', {
                    TYPE,
                    ...restNew,
                    PK: {ID, TYPE:oldType}
                }));
            }
        });

        // Update Work
        this.saveJobs('work', 'WORKID', promises, ID);

        // Update Placements
        this.saveJobs('placement', 'PLACEMENTID', promises, ID);

        // Update Training
        this.saveJobs('training', 'TRAININGID', promises, ID);

        // Wait for all api calls to finish
        Promise.all(promises).then(() => {
            this.props.toast({text:'Saved!'});
            this.props.history.push('/member/'+ID)
        });
    };

    saveJobs = (name, pk, promises, ID) => {
        let pastName = this.past(name);
        let table = capitalize(name);
        let skilltable = `${table}_SKILL`;
        let oldData = this.state[pastName];
        let newData = this.state[name];
        let oldKeys = Object.keys(oldData);
        let newKeys = Object.keys(newData);

        // Adding new
        difference(newKeys, oldKeys).forEach(key => {
            let {[pk]:id, SKILLS, ...rest} = newData[key];
            promises.push(
                insert(table, { ID, ...rest })
                    .then(res => {
                        let realKey = res.recordset[0][pk];
                        SKILLS.forEach(NAME => promises.push(insert(skilltable, {[pk]:realKey, NAME})));
                    })
            );
        });

        // Removing old
        difference(oldKeys, newKeys).forEach(key => {
            promises.push(
                del(skilltable, {[pk]:key})
                    .then(() => del(table, {[pk]:key}))
            );
        });

        // Updating old ones that weren't removed
        intersection(oldKeys, newKeys).forEach(key => {
            let {[pk]:oldID, SKILLS:oldSkills, ...restOld} = oldData[key];
            let {[pk]:newID, SKILLS:newSkills, ...restNew} = newData[key];
            difference(oldSkills, newSkills).forEach(NAME => promises.push(del(skilltable, {[pk]:key, NAME})));
            difference(newSkills, oldSkills).forEach(NAME => promises.push(insert(skilltable, {[pk]:key, NAME})));
            if(!jsonEq(restNew, restOld))
                promises.push(update(table, {...restNew, PK: {[pk]:key}}));
        });
    };

    /* ========== UPDATE ========== */
    // member text field edited
    updateMember = (evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState((prevstate) => {
            return {mem : {...prevstate.mem, [name]: value}}
        });
    };

    // job item text field edited
    updateItem = (set, key, evt) => {
        let field = evt.target.name;
        let value = evt.target.value;

        this.setState(prevState => ({
            [set]: {
                ...prevState[set],
                [key]: {
                    ...prevState[set][key],
                    [field]: value
                }
            }
        }));
    };

    // cert text field edited
    updateCert = (type, evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevstate => ({
            certs : {
                ...prevstate.certs,
                [type]: {
                    ...prevstate.certs[type],
                    [name]: value
                }
            }
        }));
    };

    // langauges edited
    setLangs = (language, key, value) => {
        this.setState(prevState => ({
            langs: {
                ...prevState.langs,
                [language]: {
                    ...prevState.langs[language],
                    [key]: value
                }
            }
        }));
    };

    /* ========== SET ========== */
    // skills list changed
    setSkills = (skills) => {
        this.setState({ skills });
    };

    // job item list changed
    setItemSkills = (set, key, SKILLS) => {
        this.setState(prevState => ({
            [set]: {
                ...prevState[set],
                [key]: {
                    ...prevState[set][key],
                    SKILLS
                }
            }
        }));
    };

    /* ========== ADD ========== */
    // add language
    addLang = (LANGUAGE) => {
        let ID = this.props.match.params.memid;
        this.setState(prevState => ({
            langs: {
                ...prevState.langs,
                [LANGUAGE]: {
                    ID,
                    LANGUAGE,
                    READ:false,
                    WRITE:false,
                    SPEAK:false
                }
            }
        }));
    };

    // add job item
    addItem = (set) => {
        let key = 'new'+this.state.nextID;
        this.setState(prevState => ({
            [set]: {
                ...prevState[set],
                [key]: defaultFor(set, key)
            },
            nextID: prevState.nextID + 1
        }));
    };

    // add cert
    addCert = () => {
        let ID = this.props.match.params.memid;
        let TYPE = 'new'+this.state.nextID;
        this.setState(prevState => ({
            certs: {
                ...prevState.certs,
                [TYPE]: {
                    ID,
                    TYPE:'',
                    YEAR:2018,
                    INSTITUTION:''
                }
            },
            nextID: prevState.nextID + 1
        }));
    };

    /* ========== REMOVE ========== */
    // remove language
    removeLang = (LANGUAGE) => {
        let {[LANGUAGE]:toDel, ...langs} = this.state.langs;
        this.setState({
            langs
        });
    };

    // remove job item
    removeItem = (set, key) => {
        let {[key]:toDel, ...rest} = this.state[set];
        this.setState({ [set]:rest });
    };

    // remove cert
    removeCert = (type) => {
        let {[type]:toDel, ...certs} = this.state.certs;
        this.setState({ certs });
    };

    removeClicked = () => {
        this.props.popup({
            title:'Confirm Delete',
            body:`Are you sure you want to completely remove ${this.state.mem.FIRSTNAME} ${this.state.mem.SURNAME}? This cannot be undone.`,
            actions:[
                <Button flat primary onClick={this.props.dismissPopup}>Cancel</Button>,
                <Button flat primary onClick={this.removeMember}>Delete Permanently</Button>
            ]
        })
    };

    // remove member
    removeMember = () => {
        this.setState({ loading: true });
        this.props.toast({text: `Deleting ${this.state.mem.FIRSTNAME} ${this.state.mem.SURNAME}...`});
        this.props.dismissPopup();
        let ID = this.state.mem.ID;
        let promises = [];

        this.removeJobs('work', 'WORKID', promises);
        this.removeJobs('training', 'TRAININGID', promises);
        this.removeJobs('placement', 'PLACEMENTID', promises);
        Object.keys(this.state.pastLangs).forEach(LANGUAGE => promises.push(del('Know_lang', {LANGUAGE, ID})));
        Object.keys(this.state.pastCerts).forEach(TYPE => promises.push(del('Has_Cert', {TYPE, ID})));
        this.state.pastSkills.forEach(NAME => promises.push(del('Has_Skill', {NAME, ID})));
        Promise.all(promises)
            .then(() => del('Member', {ID}))
            .then(() => this.props.toast({text: 'Deleted!'}))
            .then(() => this.props.history.push('/'));
    };

    removeJobs = (set, pk, promises) => {
        let pastSet = this.past(set);
        Object.keys(this.state[pastSet]).forEach(key => {
            promises.push(del(`${set}_Skill`, {[pk]:key})
                .then(() => del(set, {[pk]:key})));
        });
    };

    /* ========== RENDER ========== */
    render() {
        return (
            <div className="editMemberPage">
                {
                    this.state.loading ?
                        <Grid className="member-display"><CircularProgress id="editMemberPage"/></Grid> :
                        <EditMemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}
                                           setSkills={this.setSkills}

                                           setItemSkills={this.setItemSkills} updateItem={this.updateItem}
                                           addItem={this.addItem} removeItem={this.removeItem}

                                           onMemChange={this.updateMember}
                                           removeMember={this.removeClicked} langs={this.state.langs}
                                           setLangs={this.setLangs} addLang={this.addLang} addCert={this.addCert}
                                           removeLang={this.removeLang} certs={this.state.certs}
                                           onCertChange={this.updateCert} removeCert={this.removeCert}
                        placement={this.state.placement} training={this.state.training}/>
                }
            </div>
        );
    }
}