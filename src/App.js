import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import IndexPage from "./components/pages/IndexPage";
import NewMember from "./components/pages/NewMemberPage";
import Layout from "./components/pages/Layout";
import MemberPage from "./components/pages/MemberPage";
import EditMemberPage from "./components/pages/EditMemberPage";
import LoginPage from "./components/pages/LoginPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import Callback from "./components/Callback";
import {isLoggedIn} from "./AuthService";


export default class AppRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: ""
        }
    }

    updateTitle = (t) => {
        this.setState({
            title:t
        });
    };

    componentWithTitle = (component) => {
        return (
            ({match, location, history}) => {
                if(isLoggedIn()) {
                    return React.createElement(component, {
                        setTitle: this.updateTitle,
                        match: match,
                        location: location,
                        history: history
                    })
                }else{
                    return <Redirect to="/login"/>
                }

            }
        );
    };

    render() {
        return (
            <Router>
                <Layout title={this.state.title}>
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <Route exact path="/" render={this.componentWithTitle(IndexPage)}/>
                        <Route path="/new" render={this.componentWithTitle(NewMember)}/>
                        <Route exact path="/member/:memid" render={this.componentWithTitle(MemberPage)}/>
                        <Route path="/member/:memid/edit" component={this.componentWithTitle(EditMemberPage)}/>
                        <Route path="/callback" component={Callback}/>
                        <Route render={this.componentWithTitle(NotFoundPage)}/>
                    </Switch>
                </Layout>
            </Router>
        );
    }
}

//onUpdate={() => window.scrollTo(0, 0)}