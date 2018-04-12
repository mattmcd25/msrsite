import React from "react";
import { TableRow, TableColumn } from 'react-md';
import { Route } from 'react-router-dom'
import { PrettyValue } from './displays/DisplayUtils';

export default function MemberTableRow(props) {
    return (
        <Route render={({history}) =>(
            <TableRow key={props.data.ID} onClick={() => history.push("/member/" + props.data.ID)}>
                {Object.values(props.data).slice(1).map((val, i) => {
                    let key = Object.keys(props.data).slice(1)[i];
                    return (
                        <TableColumn key={key}>
                            {PrettyValue(key,val)}
                        </TableColumn>
                    )
                })}
            </TableRow>
        )}/>
    );
}