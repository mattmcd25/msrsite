import React from "react";
import {login} from "../../AuthService"


export default class LoginPage extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    updateUsername = (evt) =>{
        this.setState({
            username: evt.target.value
        });
    };

    updatePassword = (evt) =>{
        this.setState({
            password: evt.target.value
        });
    };



    render(){
        return (
            <div>
                <input value={this.state.username} onChange={this.updateUsername}/><br />
                <input value={this.state.password} onChange={this.updatePassword}/><br />
                <button onClick={() =>login()}>Login</button>
            </div>);
    }
}