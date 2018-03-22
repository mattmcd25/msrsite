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
            display: [],
            headers: [],
            loaded: false
        };

        getAllColumns('Member').then(cols => {
            getAllMembers().then(res => {
                this.setState({display: res, headers: cols, loaded: true});
            });
        });
    }

    render() {
        return (
            <div className="home">
                <label>
                    Search
                    <input type="text" name="search"/>
                    <br/>
                </label>

                <Link to="/new">
                    <button className="indexButton">
                        New Member
                    </button>
                </Link>

                <button className="indexButton">
                    Advanced Search
                </button>

                <MemberTable headers={this.state.headers} display={this.state.display} loaded={this.state.loaded}/>
                {/*<p>{testDB()}</p>*/}
            </div>
        );
    }
}