import React from 'react';
import { CircularProgress, Button, TextField, Grid, Cell, Card, CardTitle, CardText } from 'react-md';
import { insert } from '../../data/databaseManager';
import { HEADERS } from "../../index";
import { PrettyKey, textValidation, invalidFields } from "../displays/DisplayUtils";
import { makeDict } from "../../Utils";

export default class NewMemberPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Add Member");
        this.state = {
            mem: makeDict(Object.keys(HEADERS['Member'])),
            loading: false
        };
    };

    handleSubmit = (e) => {
        this.setState({ loading: true });
        this.props.toast({text:'Adding member...'});
        insert("Member", this.state.mem)
            .then(res => {
                let newID = res.recordset[0].ID;
                this.props.toast({text:'Added!'});
                this.props.history.push(`/member/${newID}/edit`);
            });
    };

    handleInputChange = (value, e) => {
        const target = e.target;
        const name = target.name;

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
                        <Cell size={4}>
                            <Card className="member-card">
                                <CardTitle className="card-action-title" title="New Member"/>
                                <CardText>
                                    <form onSubmit={this.handleSubmit}>
                                        {Object.keys(HEADERS['Member']).slice(1).map(field => {
                                            let x = <TextField value={this.state.mem[field]} label={PrettyKey(field)}
                                                               onChange={this.handleInputChange} id={field} name={field}
                                                               key={field} {...textValidation('Member', field)}
                                                               fullWidth={false} className="padRight"/>
                                            fields.push(x);
                                            return x;
                                        })}
                                        <label className="vertSpacer"/>
                                        <Button raised primary name="insert" disabled={invalidFields(fields)} type="submit">
                                            Add Member
                                        </Button><br/>
                                    </form>
                                </CardText>
                            </Card>
                        </Cell>
                    }
                </Grid>
        );
    }
}