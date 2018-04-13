import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginPage from "./components/pages/LoginPage";
import Callback from "./components/Callback";


export default class LockedApp extends React.Component {

    render() {
        return (
            <Router>
                <Switch>
                    <Route path="/callback" component={Callback}/>
                    <Route path="/" component={LoginPage}/>
                </Switch>
            </Router>
        );
    }
}

//onUpdate={() => window.scrollTo(0, 0)}