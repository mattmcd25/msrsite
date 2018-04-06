import React from 'react';
import MemberTable from '../MemberTable';
import { Grid } from 'react-md';
import {getAll} from "../../data/databaseManager";

export default class IndexPage extends React.Component {
    constructor(props) {
        super(props);
        this.props.setTitle("View Members");
        this.state = {
            members: []
        };
    }

    componentDidMount() {
        this.loadTable();
    };

    loadTable = () => {
        this.setState({ loaded: false });
        getAll('Member').then(res => {
            this.setState(prevState => ({
                members: res,
                loaded: true
            }));
        });
    };

    render() {
        return (
            <div className="home">
                <Grid>
                    <MemberTable members={this.state.members} loaded={this.state.loaded}
                                 onRefreshClick={this.loadTable}/>
                </Grid>
            </div>
        );
    }
}