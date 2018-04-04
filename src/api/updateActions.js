const sql = require("mssql");
const server = require("../server");

// insert : (request :table) x result => promise
// inserts data from JSON into a specified table
// SECURITY: tableID checked by my middleware, cols/vars checked by protect/bodyparser
exports.insert = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log("Trying to insert " + Object.keys(req.body) + ":" + Object.values(req.body) + " into " + tableID);
    let cols = '("' + Object.keys(req.body).reduce((acc, cur) => acc + '", "' + cur) + '")';
    let vars = '(' + Object.values(req.body).map(val => varToSQL(val)).reduce((acc, cur) => acc + ', ' + cur) + ')';
    let output = tableID==="WORK" ? " OUTPUT Inserted.WORKID" : "";
    let request = new sql.Request();
    let query = `INSERT INTO ${tableID} ${cols}${output} VALUES ${vars}`;
    return request.query(query)
        .then(recordset => {
            console.log("Success");
            if(res) res.status(201).send(recordset);
        })
        .catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};

// update : (request :table) x result => promise
// updates the specified row of the table according to JSON
// SECURITY: tableID checked by my middleware, cols/vars checked by protect/bodyparser
exports.update = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log('Trying to update ' + tableID + ' according to ' + Object.keys(req.body) + ":" + Object.values(req.body));
    let pk = req.body.PK;
    delete req.body.PK;
    let vars = Object.keys(req.body).reduce((acc, cur) => `${acc}, ${cur}=${varToSQL(req.body[cur])}`, '').substring(2);
    let cond = Object.keys(pk).reduce((acc, cur) => `${acc} AND ${cur}=${varToSQL(pk[cur])}`, '').substring(5);
    let request = new sql.Request();
    let query = `UPDATE ${tableID} SET ${vars} WHERE ${cond}`;
    return request.query(query)
        .then(recordset => {
            console.log("Success");
            if(res) res.status(202).send(recordset);
        })
        .catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};

// delete : (request :table) x result => promise
// deletes the specified row of the table according to JSON
// SECURITY: tableID checked by my middleware, cols/vars checked by protect/bodyparser
exports.delete = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log('Trying to delete from ' + tableID + ' according to ' + Object.keys(req.body) + ":" + Object.values(req.body));
    let cond = Object.keys(req.body).reduce((acc, cur) => `${acc} AND ${cur}=${varToSQL(req.body[cur])}`, '').substring(5);
    let request = new sql.Request();
    let query = `DELETE FROM ${tableID} WHERE ${cond}`;
    return request.query(query)
        .then(recordset => {
            console.log("Success");
            if(res) res.status(202).send(recordset);
        })
        .catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};

// varToSQL : 'a -> 'a
// puts extra quotes around the value if it is a String
// for use when generating INSERT or UPDATE statements
exports.varToSQL = (val) => {
    if(typeof(val) === 'string')
        return '\''+val+'\'';
    else
        return val;
};

varToSQL = exports.varToSQL;