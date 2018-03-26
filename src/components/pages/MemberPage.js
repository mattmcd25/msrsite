import React from 'react';
import { Link } from 'react-router-dom';
import {getMemberByID, getAllMemFields} from "../../data/databaseManager";

export default class MemberPage extends React.Component {
    constructor(props){
        super(props);
        console.log(this.props.match.params.memid);
        this.mem = getMemberByID(this.props.match.params.memid);
        console.log(this.mem);
        this.memfields = getAllMemFields();
    }

    submit(e) {
        console.log("edit");
        return;
    }

    render() {
        return (
            <div className="memberPage">
                {this.memfields.map(f =>
                    <div>
                        <label>{f + ": " + this.mem[f]}</label><br/>
                    </div>
                )}

                <button onClick={(e) => this.submit(e)}>
                    Edit
                </button><br/>
                <Link to="/">Home</Link>
            </div>
        );
    }
}