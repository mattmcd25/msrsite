import React from 'react';
import {getMemberByID, getAllMemFields} from "../../data/databaseManager";
import { Route } from 'react-router-dom'

export default class MemberPage extends React.Component {
    constructor(props){
        super(props);
        console.log(this.props.match.params.memid);
        this.mem = getMemberByID(this.props.match.params.memid);
        this.memfields = getAllMemFields();
    }

    render() {
        return (
            <Route render={({history}) =>(
                <div className="memberPage">
                    {this.memfields.map((f, i) =>
                        <div key={i}>
                            <label>{f + ": " + this.mem[f]}</label><br/>
                        </div>
                    )}
                    <button onClick={() => history.push("/member/" + this.mem.ID + "/edit")}>
                        Edit
                    </button>
                    <br/>
                    <button onClick={() => history.push("/")}>
                        Home
                    </button>
                </div>
            )}/>
        );
    }
}