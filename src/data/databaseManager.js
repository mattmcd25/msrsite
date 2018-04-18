import axios from 'axios'
import {getAccessToken} from "../components/AuthMan";
import {dictFromList} from "../Utils";


/// / ========== Internal Functions ==========
let conf = {
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
};
function api_get(call) {
    return axios.get(`/api/${call}`, conf).then(checkStatus).then(response => response.data);
}

function api_post(call, body) {
    return axios.post('/api/'+call, JSON.stringify(body), conf).then(checkStatus).then(response => response.data);
}

function api_patch(call, body) {
    return axios.patch('/api/'+call, JSON.stringify(body), conf).then(checkStatus).then(response => response.data);
}

function api_delete(call, body){
    let conf2 = {
        headers: {
            Authorization: `Bearer ${getAccessToken()}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: body
    };
    return axios.delete('/api/'+call, conf2).then(checkStatus).then(response => response.data);
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
        .then(json => {
            let info = json['recordsets'][0];
            return Object.assign({}, ...info.map(col => ({[col.COLUMN_NAME]:col})));
        });
}

export function getUserPermissions() {
    return api_get(`users`)
        .then(r => {
            let allUsers = Object.assign({}, ...r.map((a) => {
                let ulevel;
                try{
                    ulevel = a.app_metadata.level;
                }catch(e){
                    ulevel = 'newUser';
                }
                return {
                    [a.user_id]: {
                        email: a.email,
                        level: ulevel
                    }
                };
            }));
            console.log(allUsers);
            return allUsers;
        });
}

export function saveUserPermissions(data) {
    return api_patch('updateuser', data);
}


export function insert(table, data) {
    return api_post(`insert/${table}`, data);
}

export function update(table, data) {
    return api_patch(`update/${table}`, data);
}

export function query(table, data) {
    return api_post(`query/${table}`, data)
        .then(json => json['recordsets'][0]);
}

export function del(table, data) {
    return api_delete(`delete/${table}`, data);
}

// ========== Exported Functions - Helpers ==========
export function getMemberByID(id) {
    return query("MEMBER", {
        "ID":`${id}`
    }).then(json => json[0]);
}

export function getMemberSkillsByID(id, all=true) {
    let table = all ? "ALL_SKILLS" : "OTHER_SKILLS";
    return query(table, {
        "ID":`${id}`
    })
        .then(json => json.map(row => row.NAME))
        .then(sks => ((sks.length===1 && !sks[0]) ? [] : sks));
}

export function getMemberWorkByID(id) {
    return query("WORK_INFO", {
        "ID":`${id}`
    });
}

export function getMemberLangsByID(id) {
    return query('KNOW_LANG', {
        "ID":`${id}`
    });
}

export function getMemberCertsByID(id) {
    return query('HAS_CERT', {
        "ID": `${id}`
    });
}