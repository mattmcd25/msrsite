import React from 'react';
import {MemberTable} from "../MemberTable";
import { getAll } from "../../data/databaseManager";
import { mem_cols as headers } from "../../index";


export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            display: [],
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
            this.setState({members: res, display: res, loaded: true});
        });
    };

    updateInputValue = (evt) => {
        this.setState({
            inputValue: evt.target.value
        });

        this.setState((prevState) => ({
            display: prevState.members.filter(mem => {
                let l = Object.values(mem).filter(val => val.toString().toLowerCase().indexOf(prevState.inputValue.toLowerCase()) >=0);
                return (l.length > 0);
            })
        }));
    };

    render() {
        return (
            <div className="home">
                <label>
                    Search
                    <input value={this.state.inputValue} onChange={this.updateInputValue} type="text" name="search"/>
                </label>

                <button className="indexButton" onClick={this.loadTable}>
                    Refresh
                </button>

                <MemberTable headers={headers} display={this.state.display} loaded={this.state.loaded}/>
            </div>
        );
    }
}