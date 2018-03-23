const sql = require("mssql");
// const server = require("../server");

// selectAll : (request :table) x result => promise
// returns all data from a specified table
exports.selectAll = (req, res) => {
    let tableID = req.params['table'];

    console.log("Trying to select * from " + tableID);
    let request = new sql.Request(); // create Request object
    let query = `SELECT * FROM ${tableID}`;
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
exports.getColumns = (req, res) => {
    let tableID = req.params['table'];

    console.log("Trying to get column names for " + tableID);
    let request = new sql.Request(); // create Request object
    let query = `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${tableID}'`;
    return request.query(query) // query
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
    let query = `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`;
    return request.query(query)
        .then(recordset => {
            console.log("Success");
            if(res) res.status(200).send(recordset);
            return recordset;
        }).catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};