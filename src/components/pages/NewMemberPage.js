import React from 'react';
import { CircularProgress, Grid, Cell } from 'react-md';
import IssueButton from '../IssueButton';
import { insert } from '../../data/databaseManager';
import { CONSTANTS, HEADERS, STATUS } from "../../index";
import { dataLengthIssues } from "../displays/DisplayUtils";
import { makeDict } from "../../Utils";
import { PropListCard } from "../displays/Cards";

export default class NewMemberPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Add Member");
        let mem = makeDict(Object.keys(HEADERS['Member']).slice(1));
        mem.DATE = new Date();
        this.state = { mem, loading: false };
    };

    handleSubmit = () => {
        this.setState({ loading: true });
        this.props.toast({text:'Adding member...'});
        insert("Member", this.state.mem)
            .then(res => {
                let newID = res.recordset[0].ID;
                this.props.toast({text:'Added!'});
                this.props.history.push(`/member/${newID}/edit`);
            });
    };

    handleInputChange = (e) => {
        let target = e.target;
        let value = target.value;
        let name = target.name;

        console.log(name, value);
        this.setState(prevState => ({
            mem: {
                ...prevState.mem,
                [name]: value
            }
        }));
    };

    render() {
        let issues = dataLengthIssues([this.state.mem], 'Member');
        if(!this.state.mem.SITE || this.state.mem.SITE === '') issues.push({field:'SITE',value:''});
        if(!this.state.mem.STATUS || this.state.mem.STATUS === '') issues.push({field:'STATUS',value:''});
        return (
                <Grid className="newMemberPage">
                    {this.state.loading ?
                        <Cell size={12}><CircularProgress id="newMemberPage"/></Cell> :
                        <PropListCard edit title='New Member' data={this.state.mem} onChange={this.handleInputChange}
                                      table='Member' acData={{SITE:CONSTANTS['Site'].map(s=>s.ABBR),STATUS}}
                                      footer={
                                          <IssueButton raised primary issues={issues} onClick={this.handleSubmit}
                                                       position="right">
                                                Add Member
                                          </IssueButton>
                                      }/>
                    }
                </Grid>
        );
    }
}