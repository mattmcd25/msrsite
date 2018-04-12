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
            mem: {},
            skills: [],
            langs: [],
            workSkills: [],
            work: {},
            cert: {},
            result: []
        })
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
        if(Object.keys(genCond).length > 0) {
            promises.push(query('Member', genCond));
        }

        // do skills search
        this.state.skills.forEach(NAME => promises.push(query('All_skills', {NAME})));

        // do work search
        let workCond = filterObj(this.state.work);
        this.state.workSkills.forEach(NAME => promises.push(query('Work_info', {NAME, ...workCond})));
        if(this.state.workSkills.length === 0 && Object.keys(workCond).length > 0) {
            promises.push(query('Work_info', workCond));
        }

        // do lang search
        Object.keys(this.state.langs).forEach(langName => {
            let lang = this.state.langs[langName];
            let langCond = filterObj(lang);
            promises.push(query('Know_lang', langCond));
        });

        // do cert search
        let certCond = filterObj(this.state.cert);
        if(Object.keys(certCond).length > 0) {
            promises.push(query('Has_Cert', certCond));
        }

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
        let genData = makeDict(HEADERS['Member'].slice(1));
        let workData = makeDict(HEADERS['Work'].slice(2));
        let certData = makeDict(HEADERS['Has_Cert'].slice(1));
        return (
            <div className="queryPage">
                <Grid>
                    {this.state.mode==="query" ?
                        <QueryDisplay skills={this.state.skills} updateList={li => this.setState({ skills: li })}
                                      onMemChange={evt => this.update('mem', evt)} general={genData}
                                      onWorkChange={evt => this.update('work', evt)} work={workData}
                                      onCertChange={evt => this.update('cert', evt)} cert={certData}
                                      workSkills={this.state.workSkills} langs={this.state.langs}
                                      addLang={this.addLang} removeLang={this.removeLang}
                                      setLangs={(l, k, v) => this.setLang(l, k, v)}
                                      updateWorkList={li => this.setState({ workSkills: li })}/> :
                        <MemberTable members={this.state.result} loaded={this.state.mode==="display"}/>
                    }
                </Grid>
            </div>
        );
    }
}