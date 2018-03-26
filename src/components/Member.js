import React from "react";

export default function Member (props) {
    return (
        <tr key={props.data.ID} onDoubleClickCapture={console.log("on click " + props.data["FIRSTNAME"])}>
            {Object.values(props.data).map(val => <td>{val}</td>)}
        </tr>
    );
}