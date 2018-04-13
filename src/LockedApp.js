import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import IndexPage from "./components/pages/IndexPage";
import NewMember from "./components/pages/NewMemberPage";
import Layout from "./components/pages/Layout";
import MemberPage from "./components/pages/MemberPage";
import EditMemberPage from "./components/pages/EditMemberPage";
import LoginPage from "./components/pages/LoginPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import QueryPage from './components/pages/QueryPage';
import AdminPage from "./components/pages/AdminPage";
import Callback from "./components/Callback";
import {isLoggedIn} from "./components/AuthMan";


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