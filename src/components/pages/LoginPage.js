import React from "react";
import {logout, login, isLoggedIn} from "../AuthMan";
import LaunchScreen from "../LaunchScreen";


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
        if(isLoggedIn()){
            return <LaunchScreen/>;
        }
        return (
            <div>
                <input value={this.state.username} onChange={this.updateUsername}/><br />
                <input value={this.state.password} onChange={this.updatePassword}/><br />
                <button onClick={() => login()}>Sign In</button>
                <button onClick={() => logout()}>Sign Out</button>
            </div>);
    }
}