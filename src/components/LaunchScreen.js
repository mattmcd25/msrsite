import React from "react";
import { Media, Paper, CircularProgress } from 'react-md';

export default function LaunchScreen(props) {
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