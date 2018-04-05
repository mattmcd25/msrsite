import React from 'react';

export default class QueryPage extends React.PureComponent {
    constructor(props) {
        super(props);
        this.props.setTitle("Advanced Search");
    }

    render() {
        return (
            <div className="queryPage">
                <p>yuh</p>
            </div>
        );
    }
}