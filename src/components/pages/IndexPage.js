import React from 'react';
import {MemberTable} from "../MemberTable";
import { getAllColumns, getAll, getMemberByID } from "../../data/databaseManager";
import { Button, TextField, FontIcon } from 'react-md';

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.f("View Members");
        this.state = {
            members: [],
            display: [],
            headers: [],
            loaded: false,
            inputValue: ""
        };
    };

    componentDidMount() {
        this.loadTable();
    };

    loadTable = () => {
        this.setState({ loaded: false });
        getAllColumns('Member').then(cols => {
            getAll('Member').then(res => {
                this.setState({members: res, display: res, headers: cols, loaded: true});
            });
        });
    };

    updateInputValue = (value) => {
        this.setState({
            inputValue: value
        });

        this.setState((prevState) => ({
            display: prevState.members.filter(mem => {
                let l = Object.values(mem).filter(val => val.toString().toLowerCase().indexOf(prevState.inputValue.toLowerCase()) >=0);
                return (l.length > 0);
            })
        }));
    };

    clearInput = (evt) => {
        this.setState({
            inputValue: ''
        });
    };

    render() {
        return (
            <div className="home">
                <TextField
                    id="search"
                    label="Quick Search"
                    leftIcon={<FontIcon>search</FontIcon>}
                    inlineIndicator={
                        <Button icon className="inline-btn" onClick={this.clearInput}>clear</Button>
                    }
                    size={25}
                    fullWidth={false}
                    value={this.state.inputValue}
                    onChange={this.updateInputValue}
                    type={"text"}
                />

                <Button raised className="indexButton" onClick={this.loadTable}>
                    Refresh
                </Button>

                <MemberTable headers={this.state.headers} display={this.state.display} loaded={this.state.loaded}/>
            </div>
        );
    }
}