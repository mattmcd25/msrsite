import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import WebFontLoader from 'webfontloader';
import {getAllColumns, getAll, getFKs} from "./data/databaseManager";
import LockedApp from "./LockedApp";

export var HEADERS = {};
export var CONSTANTS = {};
export var FKS = {};
export var WORKSTATUS = ['Employed', 'Released', 'Dismissed'];
export var WORKTYPE = ['Full-time', 'Part-time', 'Temporary'];
let searchResult = [];

ReactDOM.render(
    <LockedApp/>,
    document.getElementById('root')
);

export function initialize(){
    WebFontLoader.load({
        google: {
            families: ['Roboto:300,400,500,700', 'Material Icons', 'Novo:300,400,500,700', 'Open Sans:300,400,500,700'],
        },
    });

    let constants = ['Skill', 'Language', 'Site', 'Certificate'];
    let headers = ['Member', 'Work', 'Has_Cert', 'Placement', 'Training'].concat(constants);
    let promises = [];
    headers.forEach(table => promises.push(getAllColumns(table).then(res => HEADERS[table] = res)));
    constants.forEach(table => {
        promises.push(getAll(table).then(res => CONSTANTS[table] = res));
        promises.push(getFKs(table).then(res => FKS[table] = res));
    });
    return Promise.all(promises);
}

export function storeSearch(result) {
    searchResult = result;
}

export function reclaimSearch() {
    return searchResult;
}