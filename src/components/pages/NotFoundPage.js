import React from 'react';
import { Grid, Cell } from 'react-md';

export default class NotFoundPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("Error!");
    }

    render() {
        return (
            <Grid className="not-found">
                <Cell size={12}>
                    <h1>404</h1>
                    <h2>Page not found!</h2>
                </Cell>
            </Grid>
        );
    }
}