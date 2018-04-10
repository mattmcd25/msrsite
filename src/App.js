import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import IndexPage from "./components/pages/IndexPage";
import NewMember from "./components/pages/NewMemberPage";
import Layout from "./components/pages/Layout";
import MemberPage from "./components/pages/MemberPage";
import EditMemberPage from "./components/pages/EditMemberPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import QueryPage from './components/pages/QueryPage';
import AdminPage from "./components/pages/AdminPage";

export default class AppRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            actions: []
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

    componentWithRefs = (component) => {
        return (
            ({match, location, history}) => React.createElement(component, {
                setTitle:this.updateTitle,
                setActions:this.updateActions,
                match:match,
                location:location,
                history:history
            })
        );
    };

    render() {
        return (
            <Router>
                <Layout title={this.state.title} actions={this.state.actions}>
                    <Switch>
                        {/* Homepage */}
                        <Route exact path="/" render={this.componentWithRefs(IndexPage)}/>
                        {/* Other Pages */}
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