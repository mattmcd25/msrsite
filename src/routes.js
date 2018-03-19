import React from 'react'
import { Route, Switch } from 'react-router-dom'
// import Layout from './components/pages/Layout';
import IndexPage from './components/pages/IndexPage';
import NotFoundPage from './components/pages/NotFoundPage';
import NewMember from './components/pages/NewMember';

const routes =  (
    <Switch>
        <Route exact path="/" component={IndexPage}/>
        <Route path="/new" component={NewMember}/>
        <Route component={NotFoundPage}/>
    </Switch>
)

export default routes;