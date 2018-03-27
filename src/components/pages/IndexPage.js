import React from 'react';
import MemberTable from "../MemberTable";
import MemberTableHeader from '../MemberTableHeader';
import { getAllColumns, getAll } from "../../data/databaseManager";
import { Card } from 'react-md';

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
                <Card tableCard>
                    <MemberTableHeader onClearClick={this.clearInput} value={this.state.inputValue}
                                       onChange={this.updateInputValue} onRefreshClick={this.loadTable} />
                    <MemberTable loaded={this.state.loaded} headers={this.state.headers} display={this.state.display}/>
                </Card>
            </div>
        );
    }
}