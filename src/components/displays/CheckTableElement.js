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
                    {this.props.data.map((lang, i) => <CheckTableRow index={i} key={lang.LANGUAGE} data={lang}
                                                                edit={this.props.edit} onChange={this.props.onChange}/>)}
                </TableBody>
            </DataTable>
        );
    }
}

function CheckTableRow(props) {
    return (
        <TableRow>
            {Object.keys(props.data).slice(1).map(k => (
                <TableColumn className="small" key={k}>
                    {k === 'LANGUAGE' ?
                        props.data.LANGUAGE :
                        props.edit ?
                            <Checkbox id={k} name={k} label={''} checked={props.data[k]}
                                      onChange={(v) => props.onChange(props.index, k, v)}/> :
                            props.data[k] ?
                                <FontIcon>check</FontIcon> :
                                <FontIcon>close</FontIcon>}
                </TableColumn>
            ))}
        </TableRow>
    );
}

/*
onChange={(v) => {
                                console.log(v);
                                props.onChange(props.index, k, v)}
                            }
 */