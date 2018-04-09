// ========== Internal Functions ==========
function api_get(call) {
    return fetch(`/api/${call}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(checkStatus)
        .then(parseJSON);
}

function api_post(call, body, method='POST') {
    return fetch(`/api/${call}`, {
            method: method,
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
    if (response.status >= 200 && response.status < 300) {
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



// ========== Exported Functions - Basics ==========
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
    return api_post(`update/${table}`, data, 'PATCH');
}

export function query(table, data) {
    return api_post(`query/${table}`, data)
        .then(json => json['recordsets'][0]);
}

export function del(table, data) {
    return api_post(`delete/${table}`, data, 'DELETE');
}

// ========== Exported Functions - Helpers ==========
export function getMemberByID(id) {
    return query("Member", {
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