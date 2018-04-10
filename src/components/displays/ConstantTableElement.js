import React from 'react';
import { DataTable, TableCardHeader, TableHeader, TableBody, TableRow, CircularProgress,
         TableColumn, EditDialogColumn, TablePagination, Button, FontIcon } from 'react-md';
import { CONSTANTS, HEADERS } from "../../index";
import { PrettyKey } from "./DisplayUtils";
import {del, getAll, insert, update} from "../../data/databaseManager";
import { intersection, difference, dictFromList } from "../../Utils";

export default class ConstantTableElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: CONSTANTS[props.table].slice(),
            headers: HEADERS[props.table].slice(),
            display: CONSTANTS[props.table].slice(0, 10),
            page: 1,
            start: 0,
            rowsPerPage: 10,
            loading: false
        };
    }

    handlePagination = (start, rowsPerPage, currentPage) => {
        this.setState(prevState => ({
            start,
            rowsPerPage,
            display: prevState.data.slice(start, start + rowsPerPage),
            page: currentPage
        }));
    };

    addClick = () => {
        let data = this.state.data.slice();
        data.push(Object.assign({}, ...this.state.headers.map(head => ({[head]:''}))));
        let page = Math.ceil(data.length / this.state.rowsPerPage);
        let start = (page - 1) * this.state.rowsPerPage;

        this.setState(prevState => ({
            data,
            start,
            page,
            display: data.slice(start, start + prevState.rowsPerPage)
        }));
    };

    onChange = (v, k, i) => {
        let data = this.state.data.slice();
        data[i+this.state.start] = {
            ...data[i+this.state.start],
            [k]:v
        };
        this.setState(prevState => ({
            data,
            display: data.slice(prevState.start, prevState.start + prevState.rowsPerPage)
        }));
    };

    remove = (i) => {
        let data = this.state.data;
        data.splice(i, 1);
        this.setState(prevState => ({
            data,
            display: data.slice(prevState.start, prevState.start + prevState.rowsPerPage)
        }));
    };

    save = () => {
        this.setState({ loading: true });
        // TODO ensure there are no duplicates
        let oldData = dictFromList(CONSTANTS[this.props.table], this.props.pk);
        let newData = dictFromList(this.state.data, this.props.pk);

        let oldKeys = Object.keys(oldData);
        let newKeys = Object.keys(newData);
        console.log(oldData);
        console.log(newData);

        let promises = [];

        difference(oldKeys, newKeys).forEach(key => promises.push(del(this.props.table, {[this.props.pk]:key}))); // removed
        difference(newKeys, oldKeys).forEach(key => promises.push(insert(this.props.table, newData[key]))); // added
        intersection(oldKeys, newKeys).forEach(key => {
            if(JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
                promises.push(update(this.props.table, {...newData[key], PK:{[this.props.pk]:key}}));
            }
        }); // potentially modified

        Promise.all(promises)
            .then(() => getAll(this.props.table))
            .then(res => CONSTANTS[this.props.table] = res)
            .then(() =>
                this.setState({
                    data: CONSTANTS[this.props.table].slice(),
                    display: CONSTANTS[this.props.table].slice(0, 10),
                    page: 1,
                    start: 0,
                    loading: false
                })
            ); // reload the page
    };

    render() {
        let headers = this.state.headers.map(h => <TableColumn style={{'paddingLeft':'10px','paddingRight':'10px'}} className="table3"
                                                               key={h}>{PrettyKey(h)}</TableColumn>);
        headers.push(<TableColumn/>);

        return (this.state.loading ? <CircularProgress id="settingsTable"/> :
            <div>
                <TableCardHeader className='smallHeader' visible={false} title={this.props.table+'s'}>
                    <Button flat primary onClick={this.addClick} iconChildren={<FontIcon>add</FontIcon>}>
                        Add
                    </Button>
                    <Button flat primary onClick={this.save} iconChildren={<FontIcon>save</FontIcon>}>
                        Save
                    </Button>
                </TableCardHeader>
                <DataTable baseId={this.props.table} selectableRows={false}>
                    <TableHeader>
                        <TableRow children={headers}/>
                    </TableHeader>
                    <TableBody>
                        {this.state.display.map((d,i) => {
                            let children = Object.keys(d).map(k => (
                                <EditDialogColumn style={{'paddingLeft':'10px','paddingRight':'10px'}} className="table3" inline key={k}
                                                  value={d[k]} onChange={v => this.onChange(v, k, i)}
                                                  placeholder={PrettyKey(k)}/>
                            ));
                            children.push(
                                <TableColumn key='x' className="table1" style={{'paddingLeft':'10px','paddingRight':'10px'}}>
                                    <Button icon primary onClick={() => this.remove(i)}>
                                        close
                                    </Button>
                                </TableColumn>
                            );

                            return <TableRow key={i} children={children}/>
                        })}
                    </TableBody>
                    <TablePagination rows={this.state.data.length} rowsPerPageLabel="Rows per page"
                                     onPagination={this.handlePagination} page={this.state.page}/>
                </DataTable>
            </div>
        );
    }
}