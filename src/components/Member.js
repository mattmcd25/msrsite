import React from "react";

export default function Member (props) {
    return (
        <tr key='5'>
            {Object.values(props.data).map(val => <td>{val}</td>)}
        </tr>
    );
}