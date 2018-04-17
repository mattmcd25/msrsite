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

        // searches
        this.propSearch('mem', 'Member', promises); // general
        this.state.skills.forEach(NAME => promises.push(query('All_skills', {NAME}))); // skills
        this.jobSearch('work', 'workSkills', promises); // work
        this.jobSearch('placement', 'placementSkills', promises); // placements
        this.jobSearch('training', 'trainingSkills', promises); // training
        this.propSearch('cert', 'Has_Cert', promises); // certs
        Object.keys(this.state.langs).forEach( // langs
            langName => promises.push(query('Know_lang', filterObj(this.state.langs[langName]))));

        // compute result
        let allMembers = await getAll('Member');
        let matchingIDs = allMembers.map(getID);
        for(let i in promises) {
            let res = await promises[i];
            matchingIDs = intersection(matchingIDs, res.map(getID));
        }
        let result = allMembers.filter(mem => matchingIDs.includes(mem.ID));
        this.setSearchMode(result);
    };

    propSearch = (set, table, promises) => {
        let cond = filterObj(this.state[set]);
        if(Object.keys(cond).length > 0)
            promises.push(query(table, cond));
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