import React from 'react'
import Navigation from '../Navigation';

export default function Layout(props) {
    return (
        <div className="container">
            <div className="header">
                <div className="header-title">MSR Database</div>
                <Navigation />
            </div>

            <div className="body">
                {props.children}
            </div>

            <div className="footer">

            </div>
        </div>
    );
}