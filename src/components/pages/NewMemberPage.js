import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Button, TextField, Grid, Cell, Card, CardTitle, CardText } from 'react-md';
import { insert } from '../../data/databaseManager';

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
                                <TextField size={100} value={this.state.mem.name} onChange={this.handleInputChange}
                                           type="text" name="FIRSTNAME" label="First Name"/>
                                <TextField size={100} value={this.state.mem.surname} onChange={this.handleInputChange}
                                           type="text" name="SURNAME" label="Surname"/>
                                <TextField size={20} value={this.state.mem.membership} onChange={this.handleInputChange}
                                           type="text" name="MEMBERSHIP" label="Membership"/>
                                <TextField size={10} value={this.state.mem.phone} onChange={this.handleInputChange}
                                           type="number" name="MOBILE" label="Mobile"/>
                                <TextField size={100} value={this.state.mem.address} onChange={this.handleInputChange}
                                           type="text" name="ADDRESS" label="Address"/>
                                <TextField size={10} value={this.state.mem.marital} onChange={this.handleInputChange}
                                           type="text" name="MARITAL" label="Marital"/>
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