const sql = require("mssql");
const server = require("../server");

// selectAll : (request :table) x result => promise
// returns all data from a specified table
exports.selectAll = (req, res) => {
    let tableID = req.params['table'];

    if(!server.ALLOWED_TABLES.includes(tableID.toUpperCase())) {
        err = "Invalid table name/potential SQL injection: " + tableID;
        console.log(err);
        if(res) res.status(500).send(err);
        return;
    }
    console.log("Trying to select * from " + tableID);
    let request = new sql.Request(); // create Request object
    return request.query('select * from '+tableID) // query
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

    if(!server.ALLOWED_TABLES.includes(tableID.toUpperCase())) {
        err = "Invalid table name/potential SQL injection: " + tableID;
        console.log(err);
        if(res) res.status(500).send(err);
        return;
    }
    console.log("Trying to get column names for " + tableID);
    let request = new sql.Request(); // create Request object
    return request.query('select column_name from information_schema.columns where table_name=\''+tableID+'\'') // query
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
    return request.query('select table_name from information_schema.tables')
        .then(recordset => {
            console.log("Success");
            if(res) res.status(200).send(recordset);
            return recordset;
        }).catch(err => {
            console.log(err);
            if(res) res.status(500).send(err);
        });
};