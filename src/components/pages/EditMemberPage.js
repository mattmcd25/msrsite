import React from 'react';
import {getMemberByID, update} from "../../data/databaseManager";
import { Route } from 'react-router-dom'

export default class EditMemberPage extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            mem: undefined
        };

    }

    componentDidMount(){
        getMemberByID(this.props.match.params.memid).then(amem => this.setState({mem: amem}));
    }

    updateInputValue = (evt) =>{
        const target = evt.target;
        const value = target.value;
        const name = target.name;

        this.setState((prevstate) => {
            return {mem : {...prevstate.mem, [name]: value}}
        });
    };

    render() {
        return (
            <Route render={({history}) => (
                <div className="editMemberPage">
                    {
                        this.state.mem === undefined ? "Loading" :
                            Object.keys(this.state.mem).map((f, i) => {
                                    return (f !== "ID") && (
                                        <div key={i}>
                                            <label>{f + ": "}</label>
                                            <input value={this.state.mem[f]} onChange={this.updateInputValue}
                                                   type="text" name={f}/>
                                        </div>
                                    );
                                }
                            )}
                    <br/>
                    <button onClick={() => {
                        let id = this.state.mem.ID;
                        let pk = {id: this.state.mem.ID};
                        delete this.state.mem.ID;
                        update('Member', {...this.state.mem, PK: pk});
                        history.push("/member/" + id);
                    }}>
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