import React from 'react';
import { DataTable, TableCardHeader, TableHeader, TableBody, TableRow, CircularProgress,
         TableColumn, EditDialogColumn, TablePagination, Button, FontIcon } from 'react-md';
import {CONSTANTS, FKS, HEADERS} from "../../index";
import { dataLengthIssues, PrettyKey, textValidation } from "./DisplayUtils";
import {del, getAll, insert, update} from "../../data/databaseManager";
import {intersection, difference, dictFromList, uniteRoutes, duplicates, capitalize} from "../../Utils";
import IssueButton from "../IssueButton";

export default class ConstantTableElement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: CONSTANTS[props.table].slice(),
            headers: Object.keys(HEADERS[props.table]).slice(),
            display: CONSTANTS[props.table].slice(0, 10),
            page: 1,
            start: 0,
            pk_changed: [],
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
        if(k === this.props.pk) {
            let pk_changed = this.state.pk_changed.slice();
            pk_changed.push({from:data[i+this.state.start][k], to:v});
            this.setState({ pk_changed });
        }
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
        data.splice(i+this.state.start, 1);
        this.setState(prevState => ({
            data,
            display: data.slice(prevState.start, prevState.start + prevState.rowsPerPage)
        }));
    };

    save = () => {
        this.setState({ loading: true });
        this.props.toast({text:`Saving ${this.props.table}s...`});
        let oldData = dictFromList(CONSTANTS[this.props.table], this.props.pk);
        let newData = dictFromList(this.state.data, this.props.pk);
        let routes = uniteRoutes(this.state.pk_changed);
        Object.keys(routes).forEach(to => {
            let from = routes[to];
            newData[from] = newData[to];
            delete newData[to];
        });

        let oldKeys = Object.keys(oldData);
        let newKeys = Object.keys(newData);
        let promises = [];

        difference(oldKeys, newKeys).forEach(key =>
            promises.push(del(this.props.table, {[this.props.pk]:key}).catch(e => this.catchDel(key, e)))); // removed
        difference(newKeys, oldKeys).forEach(key => promises.push(insert(this.props.table, newData[key]))); // added
        intersection(oldKeys, newKeys).forEach(key => {
            if(JSON.stringify(oldData[key]) !== JSON.stringify(newData[key])) {
                promises.push(update(this.props.table, {...newData[key], PK:{[this.props.pk]:key}}));
            }
        }); // potentially modified

        Promise.all(promises) // reload the page
            .then(this.refreshTable)
            .then(() => this.props.toast({text: 'Saved!'}));
    };

    refreshTable = () => {
        return getAll(this.props.table)
            .then(res => CONSTANTS[this.props.table] = res)
            .then(() =>
                this.setState({
                    data: CONSTANTS[this.props.table].slice(),
                    display: CONSTANTS[this.props.table].slice(0, 10),
                    page: 1,
                    start: 0,
                    pk_changed: [],
                    loading: false
                })
            );
    };

    catchDel = (key, error) => {
        this.props.popup({
            title:'Confirm Delete',
            body:`The ${this.props.table} '${key}' is still referenced by at least one member. Would you like to remove it anyway?`,
            actions:[
                <Button flat primary onClick={this.props.dismissPopup}>Cancel</Button>,
                <Button flat primary onClick={() => this.deleteAll(key)}>Delete Anyway</Button>
            ]
        });
    };

    deleteAll = (key) => {
        this.props.dismissPopup();
        this.setState({ loading: true });
        this.props.toast({text: `Force deleting ${key}...`});
        let promises = [];
        FKS[this.props.table].forEach(tab => promises.push(del(tab, {[this.props.pk]:key})));
        Promise.all(promises)
            .then(() => del(this.props.table, {[this.props.pk]:key}))
            .then(this.refreshTable)
            .then(() => this.props.toast({text: `Force removed ${key} successfully.`}));

    };

    render() {
        let headers = this.state.headers.map(h => <TableColumn style={{'paddingLeft':'10px','paddingRight':'10px'}} className="table3"
                                                               key={h}>{PrettyKey(h)}</TableColumn>);
        headers.push(<TableColumn/>);

        let fields = [];
        let body = this.state.display.map((d,i) => {
            let children = Object.keys(d).map(k => {
                let x = (
                    <EditDialogColumn style={{'paddingLeft': '10px', 'paddingRight': '10px'}}
                                      className="table3" key={k} value={d[k]}
                                      onChange={v => this.onChange(v, k, i)} placeholder={PrettyKey(k)}
                                      {...textValidation(this.props.table, k)} />
                );
                fields.push(x);
                return x;
            });
            children.push(
                <TableColumn key='x' className="table1" style={{'paddingLeft':'10px','paddingRight':'10px'}}>
                    <Button icon primary onClick={() => this.remove(i)}>
                        close
                    </Button>
                </TableColumn>
            );
            return <TableRow key={i} children={children}/>
        });

        let issues = dataLengthIssues(this.state.data, this.props.table);
        let keys = Object.values(this.state.data).map(d=>d[this.props.pk].toUpperCase());
        if(keys.includes('')) issues.push({field:this.props.pk,value:''});
        console.log(keys, duplicates(keys));
        let dups = duplicates(keys);
        if(dups.length > 0) issues.push({field:this.props.pk,value:capitalize(dups[0]),duplicate:true});

        return (this.state.loading ? <CircularProgress id="settingsTable"/> :
            <div>
                <TableCardHeader className='smallHeader' visible={false} title={this.props.table+'s'}>
                    <Button flat primary onClick={this.addClick} iconChildren={<FontIcon>add</FontIcon>}>
                        Add
                    </Button>
                    <IssueButton flat primary onClick={this.save} issues={issues} position="left"
                                 iconChildren={<FontIcon>save</FontIcon>}>
                        Save
                    </IssueButton>
                </TableCardHeader>
                <DataTable baseId={this.props.table} selectableRows={false}>
                    <TableHeader>
                        <TableRow children={headers}/>
                    </TableHeader>
                    <TableBody>
                        {body}
                    </TableBody>
                    <TablePagination rows={this.state.data.length} rowsPerPageLabel="Rows per page"
                                     onPagination={this.handlePagination} page={this.state.page}/>
                </DataTable>
            </div>
        );
    }
}