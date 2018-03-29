import axios from 'axios'
import {getAccessToken} from "../AuthService";


/// / ========== Internal Functions ==========
function api_get(call) {



    return axios.get(`/api/${call}`, {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            'Accept': 'application/json',
        }
    }).then(response => response.data)

    /*, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${getAccessToken()}`
            }
        }).then(checkStatus)
        .then(parseJSON);*/
}

function api_post(call, body) {
    return fetch(`/api/${call}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(checkStatus)
        .then(parseJSON);
}

function api_patch(call, body) {
    return fetch(`/api/${call}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).then(checkStatus)
    .then(parseJSON);
}

function checkStatus(response) {
    console.log(response);
    if (response.status >= 200 && response.status < 400) {
        return response;
    }
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error); // eslint-disable-line no-console
    throw error;
}

function parseJSON(response) {
    return response.json();
}



// ========== Exported Functions ==========
export function getAll(table) {
    return api_get(`select*/${table}`)
        .then(json => json['recordsets'][0]);
}

export function getAllColumns(table) {
    return api_get(`colnames/${table}`)
        .then(json => json['recordsets'][0].map(col => col.COLUMN_NAME));
}

export function insert(table, data) {
    return api_post(`insert/${table}`, data);
}

export function update(table, data) {
    return api_patch(`update/${table}`, data);
}

export function query(data) {
    return api_post(`query`, data)
        .then(json => json['recordsets'][0]);
}

export function getMemberByID(id) {
    return query({
        "ID":`${id}`
    }).then(json => json[0]);
}