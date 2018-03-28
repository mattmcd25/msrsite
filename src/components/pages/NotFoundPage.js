import React from 'react';
import { Link } from 'react-router-dom';

export default class NotFoundPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Error!");
    }

    render() {
        return (
            <div className="not-found">
                <h1>404</h1>
                <h2>Page not found!</h2>
                <p>
                    <Link to="/">Go back to the main page</Link>
                </p>
            </div>
        );
    }
}