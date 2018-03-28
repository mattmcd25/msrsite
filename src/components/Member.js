import React from "react";
import { TableRow, TableColumn } from 'react-md';
import { Route } from 'react-router-dom'

export default function Member(props) {
    return (
        <Route render={({history}) =>(
            <TableRow key={props.data.ID} onClick={() => history.push("/member/" + props.data.ID)}>
                {Object.values(props.data).map((val, i) =>
                    <TableColumn key={Object.keys(props.data)[i]}>
                        {val}
                    </TableColumn>)}
            </TableRow>
        )}/>
    );
}