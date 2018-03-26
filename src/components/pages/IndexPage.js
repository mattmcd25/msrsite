import React from 'react';
// import Member from "../Member";
import { Link } from 'react-router-dom';
import {MemberTable} from "../MemberTable";
import { getAllColumns, getAllMembers } from "../../data/databaseManager";
// import DatabaseManager from '../../data/DatabaseManager';


export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            display: [],
            headers: [],
            loaded: false,
            inputValue: ""
        };

        getAllColumns('Member').then(cols => {
            getAllMembers().then(res => {
                this.setState({members: res, display: res, headers: cols, loaded: true});
            });
        });

    }


    updateInputValue=(evt) =>{
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
                    <br/>
                </label>

                <Link to="/new">
                    <button className="indexButton">
                        New Member
                    </button>
                </Link>

                <Link to="/member">
                    <button className="indexButton">
                        Member Page
                    </button>
                </Link>

                <button className="indexButton">
                    Advanced Search
                </button>

                <MemberTable headers={this.state.headers} display={this.state.display} loaded={this.state.loaded}/>
            </div>
        );
    }
}