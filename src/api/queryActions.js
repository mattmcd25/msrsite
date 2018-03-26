const sql = require("mssql");
const ua = require("./updateActions");
// const server = require("../server");

// selectAll : (request :table) x result => promise
// returns all data from a specified table
// SECURITY: tableID checked by my middleware
exports.selectAll = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log("Trying to select * from " + tableID);
    let request = new sql.Request(); // create Request object
    return request.query(`SELECT * FROM `+ tableID) // query
        .then(recordset => {
            console.log("Success");
            if(res) res.status(200).send(recordset); // send records as a response
        })
        .catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};

exports.advancedQuery = (req, res) => {
    console.log("Trying to select * with cond " + Object.keys(req.body) + ":" + Object.values(req.body));
    let cond = Object.keys(req.body).reduce((acc, cur) => `${acc} AND ${cur}=${ua.varToSQL(req.body[cur])}`, '').substring(5);
    let query = `SELECT * FROM "ALL" WHERE ${cond}`;
    console.log(query);
    let request = new sql.Request();
    return request.query(query) // query
        .then(recordset => {
            console.log("Success");
            if(res) res.status(200).send(recordset); // send records as a response
        })
        .catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};

// getColumns : (request :table) x result => promise
// returns the column names from a specified table
// SECURITY: tableID checked by my middleware
exports.getColumns = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log("Trying to get column names for " + tableID);
    let request = new sql.Request(); // create Request object
    return request.query(`SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${tableID}'`) // query
        .then(recordset => {
            console.log("Success");
            if(res) res.status(200).send(recordset); // send records as a response
        }).catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};

// getTables : request x result => promise
// returns the names of all tables in the database
exports.getTables = (req, res) => {
    console.log("Trying to get all table names");
    let request = new sql.Request();
    return request.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`)
        .then(recordset => {
            console.log("Success");
            if(res) res.status(200).send(recordset);
            return recordset;
        }).catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};