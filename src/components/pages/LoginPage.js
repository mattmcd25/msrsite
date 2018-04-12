import React from "react";
import AuthMan from "../AuthMan";


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
        let am = new AuthMan();
        return (
            <div>
                <input value={this.state.username} onChange={this.updateUsername}/><br />
                <input value={this.state.password} onChange={this.updatePassword}/><br />
                <button onClick={() => am.login()}>Sign In</button>
                <button onClick={() =>am.logout()}>Sign Out</button>
            </div>);
    }
}