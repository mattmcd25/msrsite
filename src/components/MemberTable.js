import React from "react";
import Member from "./Member";

export function MemberTable(props) {
    return (
        <div>
            {!props.loaded ?
                <p>Loading database...</p> :
                <table>
                    <thead>
                    <tr>
                        {props.headers.map(head => <th key={head}>{head}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                        {props.display.map((mem) => <Member key={mem.ID} data={mem}/>)}
                    </tbody>
                </table>
            }
        </div>
    );
}