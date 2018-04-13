import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import WebFontLoader from 'webfontloader';
import { getAllColumns, getAll } from "./data/databaseManager";
import LockedApp from "./LockedApp";

export var HEADERS = [];
export var CONSTANTS = [];
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

    let headers = ['Member', 'Work', 'Skill', 'Language', 'Site', 'Certificate', 'Has_Cert'];
    let constants = ['Skill', 'Language', 'Site', 'Certificate'];
    let promises = [];
    try {
        headers.map(table => promises.push(getAllColumns(table).then(res => HEADERS[table] = res)));
        constants.map(table => promises.push(getAll(table).then(res => CONSTANTS[table] = res)));
        return Promise.all(promises);
    }catch(e){
        throw e;
    }
}

export function storeSearch(result) {
    searchResult = result;
}

export function reclaimSearch() {
    return searchResult;
}