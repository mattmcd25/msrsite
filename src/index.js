import ReactDOM from 'react-dom';
import React from "react";
import './style/index.css';
import { getAllColumns, getAll, getFKs } from "./data/databaseManager";
import LockedApp from "./LockedApp";

export var HEADERS = {};
export var CONSTANTS = {};
export var FKS = {};
export var WORKSTATUS = ['Employed', 'Released', 'Dismissed'];
export var WORKTYPE = ['Full-time', 'Part-time', 'Temporary'];
export var STATUS = ['Active', 'Employed', 'Inactive', 'Blacklisted'];
let searchResult = [];
let auth_level = '';

ReactDOM.render(
    <LockedApp/>,
    document.getElementById('root')
);

export function initialize() {
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

export const storeUserLevel = level => auth_level = level;
export const isAdmin = () => auth_level === 'admin' || auth_level === 'creator';
export const storeSearch = result => searchResult = result;
export const reclaimSearch = () => searchResult;