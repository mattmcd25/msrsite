import React from "react";
import { TableRow, TableColumn } from 'react-md';

export default function Member (props) {
    return (
        <TableRow key={props.data.ID}>
            {Object.values(props.data).map((val, i) =>
                <TableColumn key={Object.keys(props.data)[i]}>
                    {val}
                </TableColumn>)}
        </TableRow>
    );
}