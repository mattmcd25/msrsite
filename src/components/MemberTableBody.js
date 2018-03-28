import React from "react";
import { DataTable, TablePagination, TableHeader, TableRow, TableBody, TableColumn } from 'react-md';
import Member from "./MemberTableRow";

export default function MemberTableBody(props) {
    return (
        <div>
            {!props.loaded ?
                <p>Loading database...</p> :
                <DataTable baseId="member" selectableRows={false}>
                    <TableHeader>
                        <TableRow>
                            {props.headers.map(head => <TableColumn key={head}>{head}</TableColumn>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.display.map(mem => <Member key={mem.ID} data={mem}/>)}
                    </TableBody>
                    <TablePagination rows={props.rows} rowsPerPageLabel="Rows per page"
                                     onPagination={props.handlePagination} page={props.page}/>
                </DataTable>
            }
        </div>
    );
}