import React from "react";

export default function Member (props) {
    return (
        <tr key={props.data.ID}>
            {Object.values(props.data).map(val => <td>{val}</td>)}
        </tr>
    );
}