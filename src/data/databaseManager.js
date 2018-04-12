import axios from 'axios'
import {getAccessToken} from "../components/AuthMan";


/// / ========== Internal Functions ==========
let conf = {
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};
function api_get(call) {
    return axios.get(`/api/${call}`, conf).then(response => response.data)
}

function api_post(call, body) {
    return axios.post('/api/'+call, JSON.stringify(body), conf).then(checkStatus);
}

function api_patch(call, body) {
    return axios.patch('/api/'+call, JSON.stringify(body), conf).then(checkStatus);
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
        .then(json => json['data']['recordsets'][0]);
}

export function getMemberByID(id) {
    return query({
        "ID":`${id}`
    }).then(json => json[0]);
}

export function getUserInfoByToken(t){
    return (axios.get('https://rwwittenberg.auth0.com/userinfo', {
        headers: {
            Authorization: `Bearer ${t}`
        }
    }).then(console.log));
}