import React from 'react';
import { Grid, Button } from 'react-md';
import {getAll, query} from "../../data/databaseManager";
import QueryDisplay from '../displays/QueryDisplay';
import MemberTable from '../MemberTable';
import { storeSearch, reclaimSearch } from "../../index";
import { HEADERS } from "../../index";

export default class QueryPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'query',
            mem: {},
            skills: [],
            workSkills: [],
            work: {},
            result: []
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
            mem: [],
            skills: [],
            workSkills: [],
            work: {},
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

        let intersection = (arr1, arr2) => arr1.filter(x => arr2.includes(x));
        let allMembers = await getAll('Member');
        let matchingIDs = allMembers.map(mem => mem.ID);

        // do general search
        let genCond = {};
        Object.keys(this.state.mem).forEach(k => {
            let v = this.state.mem[k];
            if(v !== '') genCond[k]=v;
        });
        if(Object.keys(genCond).length > 0) {
            let res = await query('Member', genCond);
            matchingIDs = intersection(matchingIDs, res.map(m => m.ID));
        }

        // do skills search
        for(let sk in this.state.skills) {
            let NAME = this.state.skills[sk];
            let res = await query('All_skills', {NAME});
            matchingIDs = intersection(matchingIDs, res.map(m=>m.ID)); // AND
        }

        // do work search
        let workCond = {};
        Object.keys(this.state.work).forEach(k => {
            let v = this.state.work[k];
            if(v !== '') workCond[k]=v;
        });
        for(let sk in this.state.workSkills) {
            let NAME = this.state.workSkills[sk];
            let res = await query('Work_info', {NAME, ...workCond});
            matchingIDs = intersection(matchingIDs, res.map(m=>m.ID));
        }
        if(this.state.workSkills.length === 0 && Object.keys(workCond).length > 0) {
            let res = await query('Work_info', workCond);
            matchingIDs = intersection(matchingIDs, res.map(m=>m.ID));
        }

        // send result
        let result = allMembers.filter(mem => matchingIDs.includes(mem.ID));
        this.setSearchMode(result);
    };

    update = (head, evt) => {
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState((prevstate) => {
            return {[head] : {...prevstate[head], [name]: value}}
        });
    };

    render() {
        let gendata = {};
        HEADERS['Member'].slice(1).forEach(h => gendata[h]='');
        let workdata = {};
        HEADERS['Work'].slice(2).forEach(h => workdata[h]='');
        return (
            <div className="queryPage">
                <Grid>
                    {this.state.mode==="query" ?
                        <QueryDisplay skills={this.state.skills} updateList={li => this.setState({ skills: li })}
                                      onMemChange={(evt) => this.update('mem', evt)} general={gendata}
                                      onWorkChange={(evt) => this.update('work', evt)} work={workdata}
                                      workSkills={this.state.workSkills} updateWorkList={li => this.setState({ workSkills: li })}/> :
                        <MemberTable members={this.state.result} loaded={this.state.mode==="display"}/>
                    }
                </Grid>
            </div>
        );
    }
}