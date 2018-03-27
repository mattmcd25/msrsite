import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import IndexPage from "./components/pages/IndexPage";
import NewMember from "./components/pages/NewMember";
import Layout from "./components/pages/Layout";
import NotFoundPage from "./components/pages/NotFoundPage";

export default class AppRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "null"
        }
    }

    updateTitle = (t) => {
        this.setState({
            title:t
        });
    };

    render() {
        return (
            <Router>
                <Layout title={this.state.title}>
                    <Switch>
                        <Route exact path="/" render={x => <IndexPage f={this.updateTitle}/>}/>
                        <Route path="/new" render={x => <NewMember f={this.updateTitle}/>}/>
                        <Route render={x => <NotFoundPage f={this.updateTitle}/>}/>
                    </Switch>
                </Layout>
            </Router>
        );
    }
}

//onUpdate={() => window.scrollTo(0, 0)}