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


export default class AppRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            actions: [],
            toasts: []
        }
    }

    updateTitle = (t) => {
        this.setState({
            title:t,
            actions: [] // clear actions every time the page changes
        });
    };

    updateActions = (a) => {
        this.setState({
            actions:a
        });
    };

    toast = (toast) => {
        let toasts = this.state.toasts.slice();
        toasts.push(toast);
        this.setState({ toasts });
    };

    dismissToast = () => {
        let [, ...toasts] = this.state.toasts;
        this.setState({ toasts });
    };

    componentWithRefs = (component) => {
        return (
            ({match, location, history}) => {
                if(isLoggedIn()) {
                    return React.createElement(component, {
                        setTitle: this.updateTitle,
                        setActions: this.updateActions,
                        toast: this.toast,
                        match: match,
                        location: location,
                        history: history
                    })
                }else{
                    return <Redirect to='/login'/>
                }
            }
        );
    };

    render() {
        return (
            <Router>
                <Layout {...this.state} dismissToast={this.dismissToast}>
                    <Switch>
                        {/* Homepage */}
                        <Route exact path="/" render={this.componentWithRefs(IndexPage)}/>
                        {/* Other Pages */}
                        <Route path="/login" component={LoginPage}/>
                        <Route path="/callback" component={Callback}/>
                        <Route path="/new" render={this.componentWithRefs(NewMember)}/>
                        <Route exact path="/member/:memid" render={this.componentWithRefs(MemberPage)}/>
                        <Route path="/member/:memid/edit" render={this.componentWithRefs(EditMemberPage)}/>
                        <Route path="/query" render={this.componentWithRefs(QueryPage)}/>
                        <Route path="/manage" render={this.componentWithRefs(AdminPage)}/>
                        {/* Redirects */}
                        <Route path="/index.*" render={() => <Redirect to="/"/>}/>
                        <Route path="/member" render={() => <Redirect to="/"/>}/>
                        {/* Error - Default */}
                        <Route render={this.componentWithRefs(NotFoundPage)}/>
                    </Switch>
                </Layout>
            </Router>
        );
    }
}

//onUpdate={() => window.scrollTo(0, 0)}