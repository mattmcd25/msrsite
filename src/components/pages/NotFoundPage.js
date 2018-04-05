import React from 'react';

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
            </div>
        );
    }
}