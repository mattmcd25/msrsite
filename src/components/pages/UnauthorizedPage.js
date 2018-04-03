import React from 'react';
import { Link } from 'react-router-dom';

export default class UnauthorizedPage extends React.Component {
    render() {
        return (
            <div className="Unauthorized">
                <h1>Unauthorized</h1>
                <h2>Insufficient Permissions</h2>
                <p>
                    <Link to="/login">Go to login page</Link>
                </p>
            </div>
        );
    }
}