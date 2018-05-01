import React from 'react';
import { Paper, Media, Button, FontIcon } from 'react-md';
import { logout } from "../AuthMan";

export default class UnauthorizedPage extends React.PureComponent {
    render() {
        return (
            <div className="launchHor" style={{'marginTop':'7%'}}>
                <div className="launchVer">
                    <Paper zDepth={2}>
                        <Media>
                            <img src={'/msr-logo.png'} alt="msr logo"/>
                        </Media>
                        <label className="vertSpacer"/>
                        <div className='launchHor' style={{'marginTop':'0px'}}>
                            <h1>New User: Unauthorized</h1>
                        </div>
                        <div className='launchHor' style={{'margin':'0px 20px'}}>
                            <h5>Thanks for creating an account! Before you can proceed, an employee of MSR must give you
                                permission to access this app. To request access, send an email to MSR with your email
                                address in the body and a brief description of why you would like access.</h5>
                        </div><br/>
                        <div className='launchHor' style={{'marginTop':'0px'}}>
                            <a href="mailto:msr@iway.na">
                                <Button flat primary iconChildren={<FontIcon>email</FontIcon>}>
                                    Request Access
                                </Button>
                            </a>
                            <Button flat primary onClick={logout} iconChildren={<FontIcon>lock_outline</FontIcon>}>
                                Sign Out
                            </Button>
                        </div><br/>
                    </Paper>
                </div>
            </div>
        );
    }
}