import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import Layout from './components/pages/Layout';
import IndexPage from './components/pages/IndexPage';
import NotFoundPage from './components/pages/NotFoundPage';
import NewMember from './components/pages/NewMemberPage';
import MemberPage from './components/pages/MemberPage';
import EditMemberPage from "./components/pages/EditMemberPage";

const routes =  (
    <Switch>
        <Route exact path="/" component={IndexPage}/>
        <Route path="/new" component={NewMember}/>
        <Route exact path="/member/:memid" component={MemberPage}/>
        <Route path="/member/:memid/edit" component={EditMemberPage}/>
        <Route component={NotFoundPage}/>
    </Switch>
)

export default routes;