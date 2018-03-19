import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import routes from '../../routes';

export default class AppRoutes extends React.Component {
    render() {
        return (
            <Router children={routes} onUpdate={() => window.scrollTo(0, 0)}/>
        );
    }
}