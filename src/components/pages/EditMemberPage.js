import React from 'react';
import {getMemberByID} from "../../data/databaseManager";
import { Route } from 'react-router-dom'

export default class EditMemberPage extends React.Component {
    constructor(props){
        super(props);
        
        this.state = {
            ID: "",
            FIRSTNAME: "",
            SURNAME: "",
            MEMBERSHIP: "",
            MOBILE: "",
            ADDRESS: "",
            MARITAL: ""
        };


        let mem = getMemberByID(this.props.match.params.memid);

        Object.keys(this.state).map(col => {
            this.state[col] = mem[col];
            return 1;
        });



    }

    updateInputValue = (evt) =>{
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    render() {
        return (
            <Route render={({history}) =>(
                <div className="editMemberPage">
                    {Object.keys(this.state).map((f, i) =>
                        <div key={i}>
                            <label>{f + ": "}</label>
                            <input value={this.state[f]} onChange={this.updateInputValue} type="text" name={f}/>
                            <br/>
                        </div>
                    )}

                    <button onClick={() => history.push("/member/" + this.state.ID)}>
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