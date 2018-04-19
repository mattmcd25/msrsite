import React from "react";
import {login, isLoggedIn} from "../AuthMan";
import LaunchScreen from "../LaunchScreen";
import { Paper, Media, Button } from 'react-md';


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
            <div className="launchHor">
                <div className="launchVer">
                    <Paper zDepth={2}>
                        <Media>
                            <img src={'/bad-msr-logo.png'} alt="msr logo"/>
                        </Media>
                        <label className="vertSpacer"/><br/>
                        <div className='launchHor' style={{'marginTop':'0px'}}>
                            <Button flat primary onClick={login}>
                                Sign In
                            </Button><br/>
                        </div>
                        <label className="vertSpacer"/>
                    </Paper>
                </div>
            </div>
        );
            // <div>
            //     <input value={this.state.username} onChange={this.updateUsername}/><br />
            //     <input value={this.state.password} onChange={this.updatePassword}/><br />
            //     <button onClick={() => login()}>Sign In</button>
            //     <button onClick={() => logout()}>Sign Out</button>
            // </div>);
    }
}