import React from 'react';
import {
    getMemberByID, getMemberSkillsByID, getMemberWorkByID,
    update, del, insert, getMemberLangsByID, getMemberCertsByID, getMemberTrainingByID, getMemberPlacementsByID
} from "../../data/databaseManager";
import { Link } from 'react-router-dom'
import { Button, Grid, CircularProgress } from 'react-md';
import { invalidData } from "../displays/DisplayUtils";
import EditMemberDisplay from '../displays/EditMemberDisplay';
import { intersection, difference } from "../../Utils";

const defaultFor = (set, key) => {
    switch(set) {
        case 'work': return { WORKID:key, EMPLOYER: 'Untitled', LENGTH: 0, SKILLS: [] };
        case 'placement': return { PLACEMENTID: key, EMPLOYER: 'Untitled', WORKTYPE: 'Full-time',
                                    WORKSTATUS: 'Employed', STARTDATE: new Date(), SKILLS: [] };
        case 'training': return { TRAININGID: key, FIELD: 'Untitled', COMPLETEDATE: new Date(),
                                    SUCCEEDED: true, SKILLS: [] };
        default: return { key };
    }
};

export default class EditMemberPage extends React.Component {
    constructor(props){
        super(props);
        props.setActions([]);
        this.state = {
            loading: true,
            disabled: false,
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
            <Button style={{'color':'black'}} raised secondary disabled={this.state.disabled}
                    onClick={this.saveChanges}>
                Save
            </Button>
        ]);
    };

    // When state changes; used to update actions based on invalid data
    componentDidUpdate = () => {
        let disabled = invalidData([this.state.mem], 'Member')
                            || invalidData(this.state.work, 'Work')
                            || invalidData(this.state.certs, 'Has_Cert')
                            || invalidData(this.state.placement, 'Placement')
                            || invalidData(this.state.training, 'Training');
        // TODO             || duplicate certificate type
        if(disabled !== this.state.disabled) {
            this.setState({ disabled }, this.updateActions);
        }
    };

    // Initial loading from database
    componentDidMount(){
        let id = this.props.match.params.memid;
        this.getAndSave(getMemberSkillsByID(id, false), 'skills')()
            .then(this.getAndSave(getMemberWorkByID(id), 'work'))
            .then(this.getAndSave(getMemberTrainingByID(id), 'training'))
            .then(this.getAndSave(getMemberPlacementsByID(id), 'placement'))
            .then(this.getAndSave(getMemberLangsByID(id), 'langs'))
            .then(this.getAndSave(getMemberCertsByID(id), 'certs'))
            .then(this.getAndSave(getMemberByID(id), 'mem'))
            .then(() => this.props.setTitle("Editing " + this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
            .then(this.updateActions)
            .then(() => this.setState({ loading: false }));
    }

    past = (name) => `past${name[0].toUpperCase() + name.slice(1)}`;

    getAndSave = (promise, name) =>
        () => promise.then(res => this.setState({ [name]:res, [this.past(name)]:res }));

    // Save changes to the member
    saveChanges = () => {
        this.setState({ loading: true });
        this.props.toast({text:'Saving changes...'});

        let promises = [];
        let ID = this.props.match.params.memid;

        // Update basic member fields
        if(JSON.stringify(this.state.mem) !== JSON.stringify(this.state.pastMem)) {
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
            if(JSON.stringify(restNew) !== JSON.stringify(restOld)) {
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
            if(JSON.stringify({TYPE, ...restNew}) !== JSON.stringify({TYPE:oldType, ...restOld})) {
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
        let table = name[0].toUpperCase() + name.slice(1);
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
            if(JSON.stringify(restNew) !== JSON.stringify(restOld))
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
            }
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

    // remove member
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
                                           removeMember={this.removeMember} langs={this.state.langs}
                                           setLangs={this.setLangs} addLang={this.addLang} addCert={this.addCert}
                                           removeLang={this.removeLang} certs={this.state.certs}
                                           onCertChange={this.updateCert} removeCert={this.removeCert}
                        placement={this.state.placement} training={this.state.training}/>
                }
            </div>
        );
    }
}