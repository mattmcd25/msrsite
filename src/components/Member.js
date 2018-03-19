import React from "react";

export default function Member(props) {
    /*const skills = props.skills.map((skill) => {
        return (
            <li key={skill}>
                <p>{skill}</p>
            </li>
        )
    });*/

    return (
        <tr key={props.name}>
            <td>{props.name}</td>
            <td>{props.surname}</td>
            <td>{props.phone}</td>
        </tr>
    );
}