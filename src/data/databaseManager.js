// ========== Internal Functions ==========
function api_get(call) {
    return fetch(`api/${call}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(checkStatus)
        .then(parseJSON);
}

function api_post(call, body) {
    return fetch(`api/${call}`, {
            method: 'POST',
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



// ========== Exported Functions ==========
export function getAll(table) {
    return api_get(`select*/${table}`)
        .then(json => json['recordsets'][0]);
}

export function getAllColumns(table) {
    return api_get(`colnames/${table}`)
        .then(json => json['recordsets'][0].map(col => col.column_name));
}

export function insert(table, data) {
    return api_post(`insert/${table}`, data);
}