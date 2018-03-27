import React from 'react';
import {getMemberByID, getAllMemFields} from "../../data/databaseManager";
import { Route } from 'react-router-dom'

export default class EditMemberPage extends React.Component {
    constructor(props){
        super(props);
        console.log(this.props.match.params.memid);
        this.mem = getMemberByID(this.props.match.params.memid);
        this.memfields = getAllMemFields();
    }

    render() {
        console.log("test");
        return (
            <Route render={({history}) =>(
                <div className="editMemberPage">
                    {this.memfields.map(f =>
                        <div key={f}>
                            <label>{f + ": " + this.mem[f]}</label><br/>
                        </div>
                    )}

                    <button onClick={() => history.push("/member/" + this.mem.ID)}>
                        Save
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