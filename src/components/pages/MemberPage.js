import React from 'react';
import {getMemberByID} from "../../data/databaseManager";
import { Route } from 'react-router-dom'

export default class MemberPage extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            mem: undefined
        };
    }

    componentDidMount(){
        getMemberByID(this.props.match.params.memid)
            .then(amem => {
                this.setState({
                    mem: amem
                });
                this.props.setTitle(amem.FIRSTNAME + " " + amem.SURNAME);
            });
    }

    render() {
        return (
            <Route render={({history}) => (
                <div className="memberPage">
                    {
                        this.state.mem === undefined ? "Loading" :
                            Object.keys(this.state.mem).map((f, i) => {
                                    return (f !== "ID") && (
                                        <div key={i}>
                                            <label>{f + ": " + this.state.mem[f]}</label>
                                            <br/>
                                        </div>
                                    );
                                }
                            )}
                    <br/>
                    <button onClick={() => history.push("/member/" + this.state.mem.ID + "/edit")}>
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