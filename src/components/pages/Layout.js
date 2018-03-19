import React from 'react';
// import { Link } from 'react-router';

export default class Layout extends React.Component {
    render() {
        return (
            <div className="app-container">
                <header>
                    <p>header</p>
                </header>
                <div className="app-content">{this.props.children}</div>
                <footer>
                    <p>
                        This is a demo app to showcase universal rendering and routing with <strong>React</strong> and <strong>Express</strong>.
                    </p>
                </footer>
            </div>
        );
    }
};