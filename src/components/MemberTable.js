import React from 'react';
import MemberTableBody from "./MemberTableBody";
import MemberTableHeader from './MemberTableHeader';
import { Card, Cell } from 'react-md';

export default class MemberTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            match: [],   // all members that match query
            display: [], // current display page
            start: 0,
            page: 1,
            rowsPerPage: 10,
            inputValue: ""
        };
    };

    componentDidMount() {
        this.setState(prevState => ({
            match: this.props.members,
            display: this.props.members.slice(prevState.start, prevState.rowsPerPage)
        }));
    };

    componentWillReceiveProps(nextProps) {
        if(nextProps.members && nextProps.members !== this.props.members) {
            this.setState(prevState => ({
                match: nextProps.members,
                display: nextProps.members.slice(prevState.start, prevState.rowsPerPage)
            }));
        }
    }

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
            match: this.props.members.filter(mem => {
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
            display: this.props.members
        }));
    };

    render() {
        return (
            <Cell size={12}>
                <Card tableCard>
                    <MemberTableHeader onClearClick={this.clearInput} value={this.state.inputValue}
                                       onChange={this.updateInputValue} onRefreshClick={this.props.onRefreshClick}/>
                    <MemberTableBody loaded={this.props.loaded} display={this.state.display}
                                     rows={this.state.match.length} handlePagination={this.handlePagination}
                                     page={this.state.page}/>
                </Card>
            </Cell>
        );
    }
}