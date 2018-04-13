import React from "react";
import { Media, Paper, CircularProgress } from 'react-md';
import {getLevel, getSysToken} from "./AuthMan";
import {initialize} from "../index";
import App from "../App";
import ReactDOM from 'react-dom'

export default class LaunchScreen extends React.Component{
    componentDidMount(){
        console.log("Loading");
        getSysToken().then(() => getLevel()).then(() => initialize()).then(() => ReactDOM.render(<App/>, document.getElementById("root")));
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