import React from 'react';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn, FontIcon, Checkbox } from 'react-md';

const HEADERS = ['Language', 'Read', 'Write', 'Speak'];

export default class CheckTableElement extends React.Component {
    render () {
        return (
            <DataTable baseId="lang" fullWidth={false} selectableRows={false}>
                <TableHeader>
                    <TableRow>
                        {HEADERS.map(head => <TableColumn className="small" key={head}>{head}</TableColumn>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {this.props.data.map(lang => <CheckTableRow key={lang.LANGUAGE} data={lang} edit={this.props.edit}/>)}
                </TableBody>
            </DataTable>
        );
    }
}

function CheckTableRow(props) {
    return (
        <TableRow>
            <TableColumn key="lang">{props.data.LANGUAGE}</TableColumn>
            {Object.keys(props.data).slice(2).map(k => (
                <TableColumn key={k}>
                    {props.edit ?
                        <Checkbox defaultChecked={props.data[k]}/> :
                        props.data[k] ?
                            <FontIcon>check</FontIcon> :
                            <FontIcon>close</FontIcon>}
                </TableColumn>
            ))}
        </TableRow>
    );
}