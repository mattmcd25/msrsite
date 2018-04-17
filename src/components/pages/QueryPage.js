import React from 'react';
import { Grid, Button } from 'react-md';
import {getAll, query} from "../../data/databaseManager";
import QueryDisplay from '../displays/QueryDisplay';
import MemberTable from '../MemberTable';
import { storeSearch, reclaimSearch } from "../../index";
import { HEADERS } from "../../index";
import { intersection, makeDict, filterObj } from "../../Utils";

export default class QueryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'query',
        };
    }

    componentDidMount() {
        let search = reclaimSearch();
        if(search.length === 0)
            this.setQueryMode();
        else
            this.setSearchMode(search);
    }

    clear = () => {
        this.setState({
            mem: makeDict(Object.keys(HEADERS['Member']).slice(1)),
            skills: [],
            langs: [],
            workSkills: [],
            work: makeDict(Object.keys(HEADERS['Work']).slice(2)),
            placement: makeDict(Object.keys(HEADERS['Placement']).slice(2)),
            placementSkills: [],
            training: makeDict(Object.keys(HEADERS['Training']).slice(2)),
            trainingSkills: [],
            cert: makeDict(Object.keys(HEADERS['Has_Cert']).slice(1)),
            result: []
        });
        if(this.display) this.display.clearACs();
    };

    setQueryMode = () => {
        storeSearch([]);
        this.setState({ mode: 'query' });
        this.clear();
        this.props.setTitle("Advanced Search");
        this.props.setActions([
            <Button raised secondary style={{'color': 'black'}} onClick={this.clear}>
                Start Over
            </Button>,
            <label className="spacer"/>,
            <Button raised secondary style={{'color': 'black'}} onClick={this.search}>
                Search
            </Button>
        ]);
    };

    setSearchMode = (result) => {
        storeSearch(result);
        this.setState({
            mode: 'display',
            result
        });
        this.props.setTitle("Advanced Search Results");
        this.props.setActions(
            <Button raised secondary style={{'color':'black'}} onClick={this.setQueryMode}>
                Start New Search
            </Button>
        );
    };

    search = async () => {
        this.setState({ mode: 'loading' });

        let getID = member => member.ID;
        let promises = [];

        // do general search
        let genCond = filterObj(this.state.mem);
        if(Object.keys(genCond).length > 0)
            promises.push(query('Member', genCond));

        // do skills search
        this.state.skills.forEach(NAME => promises.push(query('All_skills', {NAME})));

        // do work search
        // this.jobSearch('work', 'workSkills', promises);
        // this.jobSearch('placement', 'placementSkills', promises);
        // this.jobSearch('training', 'trainingSkills', promises);
        let workCond = filterObj(this.state.work);
        this.state.workSkills.forEach(NAME => promises.push(query('Work_info', {NAME, ...workCond})));
        if(this.state.workSkills.length === 0 && Object.keys(workCond).length > 0)
            promises.push(query('Work_info', workCond));

        // do placement search
        let placeCond = filterObj(this.state.placement);
        this.state.placementSkills.forEach(NAME => promises.push(query('Placement_info', {NAME, ...placeCond})));
        if(this.state.placementSkills.length === 0 && Object.keys(placeCond).length > 0)
            promises.push(query('Placement_info', placeCond));

        // do training search
        let trainCond = filterObj(this.state.training);
        this.state.trainingSkills.forEach(NAME => promises.push(query('Training_info', {NAME, ...trainCond})));
        if(this.state.trainingSkills.length === 0 && Object.keys(trainCond).length > 0)
            promises.push(query('Training_info', trainCond));

        // do lang search
        Object.keys(this.state.langs).forEach(langName => {
            let lang = this.state.langs[langName];
            let langCond = filterObj(lang);
            promises.push(query('Know_lang', langCond));
        });

        // do cert search
        let certCond = filterObj(this.state.cert);
        if(Object.keys(certCond).length > 0)
            promises.push(query('Has_Cert', certCond));

        // send result
        let allMembers = await getAll('Member');
        let matchingIDs = allMembers.map(getID);
        for(let i in promises) {
            let res = await promises[i];
            matchingIDs = intersection(matchingIDs, res.map(getID));
        }
        let result = allMembers.filter(mem => matchingIDs.includes(mem.ID));
        this.setSearchMode(result);
    };

    jobSearch = (set, skillSet, promises) => {
        let cond = filterObj(this.state[set]);
        this.state[skillSet].forEach(NAME => promises.push(query(`${set}_info`, {NAME, ...cond})));
        if(this.state[skillSet].length === 0 && Object.keys(cond).length > 0)
            promises.push(query(`${set}_info`, cond));
    };

    update = (head, evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            [head] : {
                ...prevState[head],
                [name]: value
            }
        }));
    };

    setLang = (l, k, v) => {
        this.setState(prevState => ({
            langs : {
                ...prevState.langs,
                [l] : {
                    ...prevState.langs[l],
                    [k]:v
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

    render() {
        return (
            <div className="queryPage">
                <Grid>
                    {this.state.mode==="query" ?
                        <QueryDisplay general={this.state.mem} work={this.state.work} placement={this.state.placement}
                                      training={this.state.training} langs={this.state.langs} cert={this.state.cert}

                                      placementSkills={this.state.placementSkills} skills={this.state.skills}
                                      trainingSkills={this.state.trainingSkills} workSkills={this.state.workSkills}

                                      addLang={this.addLang} removeLang={this.removeLang} setLangs={this.setLang}
                                      update={this.update} updateList={(k, li) => this.setState({ [k]: li })}

                                      ref={e => this.display = e}/> :
                        <MemberTable members={this.state.result} loaded={this.state.mode==="display"}/>
                    }
                </Grid>
            </div>
        );
    }
}