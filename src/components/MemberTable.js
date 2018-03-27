import React from "react";
import { DataTable, TableHeader, TableRow, TableBody, TableColumn } from 'react-md';
import Member from "./Member";

export default function MemberTable(props) {
    return (
        <div>
            {!props.loaded ?
                <p>Loading database...</p> :
                <DataTable selectableRows={false}>
                    <TableHeader>
                        <TableRow>
                            {props.headers.map(head => <TableColumn key={head}>{head}</TableColumn>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.display.map(mem => <Member key={mem.ID} data={mem}/>)}
                    </TableBody>
                </DataTable>
            }
        </div>
    );
}