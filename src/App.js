import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import IndexPage from "./components/pages/IndexPage";
import NewMember from "./components/pages/NewMemberPage";
import Layout from "./components/pages/Layout";
import MemberPage from "./components/pages/MemberPage";
import EditMemberPage from "./components/pages/EditMemberPage";
import NotFoundPage from "./components/pages/NotFoundPage";

export default class AppRoutes extends React.Component {
    render() {
        return (
            <Router onUpdate={() => window.scrollTo(0, 0)}>
                <Layout>
                    <Switch>
                        <Route exact path="/" component={IndexPage}/>
                        <Route path="/new" component={NewMember}/>
                        <Route exact path="/member/:memid" component={MemberPage}/>
                        <Route path="/member/:memid/edit" component={EditMemberPage}/>
                        <Route component={NotFoundPage}/>
                    </Switch>
                </Layout>
            </Router>
        );
    }
}