import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import Layout from './components/pages/Layout';
import IndexPage from './components/pages/IndexPage';
import NotFoundPage from './components/pages/NotFoundPage';
import NewMember from './components/pages/NewMemberPage';
import MemberPage from './components/pages/MemberPage';

const routes =  (
    <Switch>
        <Route exact path="/" component={IndexPage}/>
        <Route path="/new" component={NewMember}/>
        <Route path="/member:memid" component={MemberPage}/>
        <Route component={NotFoundPage}/>
    </Switch>
)

export default routes;