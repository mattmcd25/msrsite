import React from "react";
import { Media, Paper, CircularProgress } from 'react-md';
import App from "../App";
import ReactDOM from 'react-dom'
import {initialize} from "../index";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import {isLoggedIn, logout} from "./AuthMan";

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
            try {
                initialize().then(() => {
                    ReactDOM.render(<App/>, document.getElementById("root"))
                });
            } catch (e) {
                console.log("401 doe");
                ReactDOM.render(<UnauthorizedPage/>);
            }
        }
    }

    render() {
        return (
            <div className="launchHor">
                <div className="launchVer">
                    <Paper zDepth={2}>
                        <Media>
                            <img src={'/bad-msr-logo.png'} alt="msr logo"/>
                        </Media>
                        <CircularProgress id="launchScreen"/>
                    </Paper>
                </div>
            </div>
        )
    }
}