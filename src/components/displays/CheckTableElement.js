import React from 'react';
import { DataTable, TableHeader, TableBody, TableRow, TableColumn,
         FontIcon, Checkbox, Autocomplete, Button } from 'react-md';
import Tooltip from '../Tooltip';
import {PrettyKey} from "./DisplayUtils";

const HEADERS = (edit, props) => {
    let l = Object.keys(Object.values(props.data)[0]).slice(1);
    if (edit && props.remove) l.push('');
    return l;
};

export default class CheckTableElement extends React.Component {
    render () {
        return (
            <div>
                {Object.keys(this.props.data).length === 0 ?
                    <h5>None</h5> :
                    <DataTable baseId="lang" fullWidth={false} selectableRows={false}>
                        <TableHeader>
                            <TableRow>
                                {HEADERS(this.props.edit, this.props).map(head => (
                                    <TableColumn grow={head===Object.keys(Object.values(this.props.data)[0])[1]}
                                                 className="small" key={head}>{PrettyKey(head)}</TableColumn>)
                                )}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Object.keys(this.props.data).map(key => (
                                <CheckTableRow key={key} data={this.props.data[key]} tip={this.props.tips && this.props.tips[key].DESC}
                                               edit={this.props.edit} onChange={this.props.onChange}
                                               remove={this.props.remove}/>))}
                        </TableBody>
                    </DataTable>
                }
                {this.props.edit && this.props.acData ? <Autocomplete id="langs-autocomplete" label={`Add New Language`}
                              data={this.props.acData.filter(l => !Object.keys(this.props.data).includes(l))}
                              onAutocomplete={this.props.add} clearOnAutocomplete size={30} fullWidth={false}/> : false}
        </div>
        );
    }
}

function CheckTableRow(props) {
    let titleKey = Object.keys(props.data)[1];
    let title = props.data[titleKey];

    let children = Object.keys(props.data).slice(1).map(k => (
        <TableColumn className="small" key={k}>
            <Tooltip tooltipPosition="top" tooltipLabel={props.tip}>
                {k === titleKey ?
                    title :
                    props.edit ?
                        <Checkbox id={title+''+k} name={title+''+k} label={''} checked={props.data[k]}
                                  onChange={v => props.onChange(title, k, v)}/> :
                        props.data[k] ?
                            <FontIcon primary>check</FontIcon> :
                            <FontIcon error>close</FontIcon>}
            </Tooltip>
        </TableColumn>
    ));

    if(props.edit && props.remove) children.push(
        <TableColumn className="small">
            <Tooltip tooltipPosition="top" tooltipLabel={props.tip}>
                <Button icon primary onClick={() => props.remove(title)}>
                    close
                </Button>
            </Tooltip>
        </TableColumn>
    );

    return <TableRow children={children}/>;
}