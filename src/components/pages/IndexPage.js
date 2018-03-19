import React from 'react';
// import Member from "../Member";
import { Link } from 'react-router-dom';
import MemberTable from "../MemberTable";

export default class IndexPage extends React.Component {
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

                <MemberTable/>
            </div>
        );
    }
}