import React from 'react';
import MemberTableBody from "../MemberTableBody";
import MemberTableHeader from '../MemberTableHeader';
import { getAll } from "../../data/databaseManager";
import { Card } from 'react-md';
import { mem_cols as headers } from "../../index";

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);

        this.props.setTitle("View Members");
        this.state = {
            members: [], // all members
            match: [],   // all members that match query
            display: [], // current display page
            start: 0,
            page: 1,
            rowsPerPage: 10,
            loaded: false,
            inputValue: ""
        };
    };

    componentDidMount() {
        this.loadTable();
    };

    loadTable = () => {
        this.setState({ loaded: false });
        getAll('Member').then(res => {
            this.setState(prevState => ({
                members: res,
                match: res,
                display: res.slice(prevState.start, prevState.rowsPerPage),
                loaded: true
            }));
        });
    };

    handlePagination = (start, rowsPerPage, currentPage) => {
        this.setState(prevState => ({
            start: start,
            rowsPerPage: rowsPerPage,
            display: prevState.match.slice(start, start + rowsPerPage),
            page: currentPage
        }));
    };

    updateInputValue = (value) => {
        this.setState({
            inputValue: value
        });

        this.setState((prevState) => ({
            match: prevState.members.filter(mem => {
                let l = Object.values(mem).filter(val => val.toString().toLowerCase().indexOf(prevState.inputValue.toLowerCase()) >=0);
                return (l.length > 0);
            }),
            start: 0,
            page: 1
        }));

        this.setState(prevState => ({
            display: prevState.match.slice(prevState.start, prevState.start + prevState.rowsPerPage)
        }));
    };

    clearInput = () => {
        this.setState((prevState) => ({
            inputValue: '',
            display: prevState.members
        }));
    };



    render() {
        return (
            <div className="home">
                <Card tableCard>
                    <MemberTableHeader onClearClick={this.clearInput} value={this.state.inputValue}
                                       onChange={this.updateInputValue} onRefreshClick={this.loadTable}/>
                    <MemberTableBody loaded={this.state.loaded} headers={headers}
                                     display={this.state.display} rows={this.state.match.length}
                                     handlePagination={this.handlePagination} page={this.state.page}/>
                </Card>
            </div>
        );

    }
}