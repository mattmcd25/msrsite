import React from 'react';
import { Link } from 'react-router-dom';
import {logout} from "../AuthMan";

export default class UnauthorizedPage extends React.Component {
    render() {
        return (
            <div className="Unauthorized">
                <h1>Unauthorized</h1>
                <h2>Insufficient Permissions</h2>
                <p>
                    <Link to="/login" onClick={logout}>Go to login page</Link>
                </p>
            </div>
        );
    }
}