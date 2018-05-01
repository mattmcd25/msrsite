import React from "react";
import {login, isLoggedIn} from "../AuthMan";
import LaunchScreen from "../LaunchScreen";
import { Paper, Media, Button, FontIcon } from 'react-md';
import WebFontLoader from "webfontloader";


export default class LoginPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
        }
    }

    componentWillMount() {
        WebFontLoader.load({
            google: {
                families: ['Roboto:300,400,500,700', 'Material Icons', 'Novo:300,400,500,700', 'Open Sans:300,400,500,700'],
            },
        });
    }

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
                            <Button flat primary onClick={login} iconChildren={<FontIcon>lock_open</FontIcon>}>
                                Sign In
                            </Button><br/>
                        </div>
                        <label className="vertSpacer"/>
                    </Paper>
                </div>
            </div>
        );
    }
}