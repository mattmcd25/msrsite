import React from "react";
import { Media, Paper, CircularProgress } from 'react-md';
import ReactDOM from 'react-dom'
import {initialize, storeUserLevel} from "../index";
import App from "../App";
import LimitedApp from '../LimitedApp';
import UnauthorizedPage from "./pages/UnauthorizedPage";
import {isLoggedIn, logout} from "./AuthMan";
import {getUserLevel} from "../data/databaseManager";

export default class LaunchScreen extends React.Component{
    constructor(props){
        super(props);
        this.authenticated = false;
    }

    componentDidMount(){
        if(!isLoggedIn()) {
            logout();
        }
        else {
            getUserLevel().then(level => {
                storeUserLevel(level);

                switch(level) {
                    case 'creator':
                    case 'admin':
                        return initialize().then(() => ReactDOM.render(<App/>, document.getElementById("root")));
                    case 'user':
                        return initialize().then(() => ReactDOM.render(<LimitedApp/>, document.getElementById("root")));
                    default:
                        return ReactDOM.render(<UnauthorizedPage/>, document.getElementById("root"));
                }
            });
        }
    }

    render() {
        return (
            <div className="launchHor">
                <div className="launchVer">
                    <Paper zDepth={2}>
                        <Media>
                            <img src={'/msr-logo.png'} alt="msr logo"/>
                        </Media>
                        <CircularProgress id="launchScreen"/>
                    </Paper>
                </div>
            </div>
        )
    }
}