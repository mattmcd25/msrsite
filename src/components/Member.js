import React from "react";
import { Route } from 'react-router-dom'

export default function Member(props){
    return (
        <Route render={({history}) =>(
            <tr key={props.data.ID} onClick={() => history.push("/member/" + props.data.ID)}>
                {Object.values(props.data).map((val, i) => <td key={i}>{val}</td>)}</tr>)}/>

        );
}

