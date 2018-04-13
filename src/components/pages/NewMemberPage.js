import React from 'react';
import { CircularProgress, Button, TextField, Grid, Cell, Card, CardTitle, CardText } from 'react-md';
import { insert } from '../../data/databaseManager';
import {CONSTANTS, HEADERS} from "../../index";
import { PrettyKey, textValidation, invalidFields } from "../displays/DisplayUtils";
import { makeDict } from "../../Utils";
import { PropListCard } from "../displays/Cards";

export default class NewMemberPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Add Member");
        this.state = {
            mem: makeDict(Object.keys(HEADERS['Member']).slice(1)),
            loading: false
        };
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

        this.setState(prevState => ({
            mem: {
                ...prevState.mem,
                [name]: value
            }
        }));
    };

    render() {
        let fields = [];
        return (
                <Grid className="newMemberPage">
                    {this.state.loading ?
                        <Cell size={12}><CircularProgress id="newMemberPage"/></Cell> :
                        <PropListCard edit title='New Member' data={this.state.mem}
                                      onChange={this.handleInputChange} table='Member'
                                      acData={{SITE:CONSTANTS['Site'].map(s=>s.ABBR)}}
                                        footer={
                                            <Button raised primary name="insert" disabled={invalidFields(fields)}
                                                    onClick={this.handleSubmit}>
                                                Add Member
                                            </Button>}/>
                    }
                </Grid>
        );
    }
}