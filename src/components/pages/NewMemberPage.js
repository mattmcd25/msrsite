import React from 'react';
import { CircularProgress, Button, TextField, Grid, Cell, Card, CardTitle, CardText } from 'react-md';
import { insert } from '../../data/databaseManager';
import { HEADERS } from "../../index";
import { PrettyKey } from "../displays/DisplayUtils";

export default class NewMemberPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Add Member");
        this.state = {
            mem: {},
            loading: false
        };
    };

    handleSubmit = (e) => {
        this.setState({ loading: true });
        insert("Member", this.state.mem)
            .then(res => {
                let newID = res.recordset[0].ID;
                this.props.history.push(`/member/${newID}/edit`);
            });
    };

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState(prevState => ({
            mem: {
                ...prevState.mem,
                [name]: value
            }
        }));
    };

    render() {
        return (
            this.state.loading ?
                <CircularProgress id="newMemberPage"/> :
                <Grid className="newMemberPage">
                    <Cell size={4}>
                        <Card className="member-card">
                            <CardTitle className="card-action-title" title="New Member"/>
                            <CardText>
                                {HEADERS['Member'].slice(1).map(field => (
                                    <TextField size={100} value={this.state.mem[field]} onChange={this.handleInputChange}
                                               type="text" name={field} label={PrettyKey(field)}/>))}
                                <label className="vertSpacer"/>
                                <Button raised primary name="insert" onClick={this.handleSubmit}>
                                    Add Member
                                </Button><br/>
                            </CardText>
                        </Card>
                    </Cell>
                </Grid>
        );
    }
}