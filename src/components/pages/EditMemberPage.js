import React from 'react';
import {
    getMemberByID, getMemberSkillsByID, getMemberWorkByID,
    update, del, insert, getMemberLangsByID, getMemberCertsByID
} from "../../data/databaseManager";
import { Link } from 'react-router-dom'
import { Button, Grid, CircularProgress } from 'react-md';
import { PrettyWork, invalidData } from "../displays/DisplayUtils";
import EditMemberDisplay from '../displays/EditMemberDisplay';
import { intersection, difference, dictFromList } from "../../Utils";

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

    actions = () => {
        return [
            <Link to={`/member/${this.props.match.params.memid}`}>
                <Button style={{'color':'black'}} raised secondary children="Cancel" />
            </Link>,
            <label className="spacer"/>,
            <Button style={{'color':'black'}} raised secondary disabled={this.state.disabled}
                    onClick={this.saveChanges}>
                Save
            </Button>
        ];
    };

    componentDidUpdate = () => {
        let disabled = invalidData([this.state.mem], 'Member')
                            || invalidData(this.state.work, 'Work')
                            || invalidData(this.state.certs, 'Has_Cert');
        if(disabled !== this.state.disabled) {
            this.setState({ disabled }, () => this.props.setActions(this.actions()));
        }
    };

    // initial loading
    componentDidMount(){
        let id = this.props.match.params.memid;
        getMemberSkillsByID(id, false)
            .then(skills => this.setState({ skills, pastSkills: skills }))
            .then(() => getMemberWorkByID(id))
            .then(work => this.setState({ work: PrettyWork(work), pastWork: PrettyWork(work) }))
            .then(() => getMemberLangsByID(id))
            .then(langs => this.setState({ langs: dictFromList(langs, 'LANGUAGE'), pastLangs: dictFromList(langs, 'LANGUAGE') }))
            .then(() => getMemberCertsByID(id))
            .then(certs => this.setState({ certs: dictFromList(certs, 'TYPE'), pastCerts: dictFromList(certs, 'TYPE') }))
            .then(() => getMemberByID(id))
            .then(mem => this.setState({ mem, pastMem: mem }))
            .then(() => this.props.setTitle("Editing " + this.state.mem.FIRSTNAME + " " + this.state.mem.SURNAME))
            .then(() => this.props.setActions(this.actions()))
            .then(() => this.setState({ loading: false }));
    }

    // save changes to the member
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
        // TODO check for duplicates
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

        // Adding new work
        let oldWork = Object.keys(this.state.pastWork);
        let newWork = Object.keys(this.state.work);
        difference(newWork, oldWork).forEach(workID => {
            let {WORKID:fakeID, SKILLS, ...restWork} = this.state.work[workID];
            promises.push(insert('Work', {
                ID,
                ...restWork
            }).then(res => {
                let WORKID = res.recordset[0].WORKID;
                SKILLS.forEach(NAME => promises.push(insert('Work_skill', {WORKID, NAME})));
            }));
        });

        // Removing old work
        difference(oldWork, newWork).forEach(WORKID => {
            promises.push(del('Work_Skill', {WORKID})
                .then(() => del('Work', {WORKID})));
        });

        // Updating old&&new work
        intersection(oldWork, newWork).forEach(WORKID => {
            let {WORKID:pastID, SKILLS:oldSkills, ...restPast} = this.state.pastWork[WORKID];
            let {WORKID:curID, SKILLS:newSkills, ...restWork} = this.state.work[WORKID];
            difference(oldSkills, newSkills).forEach(NAME => promises.push(del('Work_skill', {WORKID, NAME})));
            difference(newSkills, oldSkills).forEach(NAME => promises.push(insert('Work_skill', {WORKID, NAME})));
            if(JSON.stringify(restWork) !== JSON.stringify(restPast))
                promises.push(update('Work', {...restWork, PK: {WORKID}}));
        });

        // fin
        Promise.all(promises).then(() => {
            this.props.toast({text:'Saved!'});
            this.props.history.push('/member/'+ID)
        });
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

    // skills list changed
    setSkills = (skills) => {
        this.setState({ skills });
    };

    // work skills list changed
    setWorkSkills = (workID, SKILLS) => {
        this.setState(prevState => ({
            work: {
                ...prevState.work,
                [workID]: {
                    ...prevState.work[workID],
                    SKILLS
                }
            }
        }));
    };

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

    removeLang = (LANGUAGE) => {
        let {[LANGUAGE]:toDel, ...langs} = this.state.langs;
        this.setState({
            langs
        });
    };

    // add work
    addWork = () => {
        let WORKID = 'new'+this.state.nextID;
        this.setState(prevState => ({
            work: {
                ...prevState.work,
                [WORKID]: {
                    WORKID,
                    EMPLOYER: 'Untitled',
                    LENGTH: 0,
                    SKILLS: []
                }
            },
            nextID: prevState.nextID + 1
        }));
    };

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

    // remove work
    removeWork = (workID) => {
        let {[workID]:toDel, ...work} = this.state.work;
        this.setState({ work });
    };

    removeCert = (type) => {
        let {[type]:toDel, ...certs} = this.state.certs;
        this.setState({ certs });
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
                        <Grid className="member-display"><CircularProgress id="editMemberPage"/></Grid> :
                        <EditMemberDisplay mem={this.state.mem} skills={this.state.skills} work={this.state.work}
                                           setSkills={this.setSkills} setWorkSkills={this.setWorkSkills}
                                           onMemChange={this.updateMember} onWorkChange={this.updateWork}
                                           addWork={this.addWork} removeWork={this.removeWork}
                                           removeMember={this.removeMember} langs={this.state.langs}
                                           setLangs={this.setLangs} addLang={this.addLang} addCert={this.addCert}
                                           removeLang={this.removeLang} certs={this.state.certs}
                                           onCertChange={this.updateCert} removeCert={this.removeCert}/>
                }
            </div>
        );
    }
}