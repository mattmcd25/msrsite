import test_data from "./data.js"

// function api_call(call, cb) {
//     return fetch(`api/${call}`, {
//         accept: "application/json"
//     })
//         .then(checkStatus)
//         .then(cb);
// }

function api_call_json(call, cb) {
    return fetch(`api/${call}`, {
        accept: "application/json"
    })
        .then(checkStatus)
        .then(parseJSON)
        .then(cb);
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



// export function connect() {
//     return api_call('connect');
// }

export function getMemberByID(id){
    return test_data[id-1];
}

export function getAllMemFields(){
    return ["ID",
        "FIRSTNAME",
        "SURNAME",
        "MEMBERSHIP",
        "MOBILE",
        "ADDRESS",
        "MARITAL"];
}

export function getAllMembers() {
    return api_call_json('select*/Member', json => {
        return json['recordsets'][0];
    });
}

export function getAllColumns(table) {
    return api_call_json('colnames/'+table, json => {
        return json['recordsets'][0].map(col => {
            return col.column_name;
        });
    });
}