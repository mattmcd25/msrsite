import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import IndexPage from "./components/pages/IndexPage";
import Layout from "./components/pages/Layout";
import MemberPage from "./components/pages/MemberPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import QueryPage from './components/pages/QueryPage';
import {isLoggedIn, logout} from "./components/AuthMan";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            actions: [],
            toasts: [],
            popups: []
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

    popup = (popup) => {
        let popups = this.state.popups.slice();
        popups.push(popup);
        this.setState({ popups });
    };

    dismissToast = () => {
        let [, ...toasts] = this.state.toasts;
        this.setState({ toasts });
    };

    dismissPopup = () => {
        let [, ...popups] = this.state.popups;
        this.setState({ popups });
    };

    componentWithRefs = (component) => {
        return (
            ({match, location, history}) => {
                if(isLoggedIn()) {
                    return React.createElement(component, {
                        setTitle: this.updateTitle,
                        setActions: this.updateActions,
                        toast: this.toast,
                        popup: this.popup,
                        dismissPopup: this.dismissPopup,
                        match: match,
                        location: location,
                        history: history
                    })
                }
                else {
                    logout();
                }
            }
        );
    };

    render() {
        return (
            <Router>
                <Layout {...this.state} dismissToast={this.dismissToast} dismissPopup={this.dismissPopup}>
                    <Switch>
                        {/* Homepage */}
                        <Route exact path="/" render={this.componentWithRefs(IndexPage)}/>
                        {/* Other Pages */}
                        <Route exact path="/member/:memid" render={this.componentWithRefs(MemberPage)}/>
                        <Route path="/query" render={this.componentWithRefs(QueryPage)}/>
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