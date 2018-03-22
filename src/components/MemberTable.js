import React from "react";
import Member from "./Member";
import { getAllColumns, getAllMembers } from "../data/databaseManager";

export default class MemberTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            members: [],
            headers: [],
            loaded: false
        };

        getAllColumns('Member').then(cols => {
            getAllMembers().then(res => {
                this.setState({members: res, headers: cols, loaded: true});
            });
        });
    }

    render() {
        return (
            <div>
                {!this.state.loaded ?
                    <p>Loading database...</p> :
                    <table>
                        <thead>
                            <tr>
                                {this.state.headers.map(head => <th key={head}>{head}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.members.map((mem) => <Member data={mem}/>)}
                        </tbody>
                    </table>
                }
            </div>
        );
    }
}