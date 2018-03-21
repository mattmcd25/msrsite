const sql = require("mssql");

// selectAll : (request :table) x result => promise
// returns all data from a specified table
exports.selectAll = (req, res) => {
    let tableID = req.params['table'];

    console.log("Trying to select * from " + tableID);
    let request = new sql.Request(); // create Request object
    return request.query('select * from '+tableID) // query
        .then(recordset => {
            console.log("Success");
            res.status(200).send(recordset); // send records as a response
        })
        .catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
};

// getColumns : (request :table) x result => promise
// returns the column names from a specified table
exports.getColumns = (req, res) => {
    let tableID = req.params['table'];

    console.log("Trying to get column names for " + tableID);
    let request = new sql.Request(); // create Request object
    return request.query('select column_name from information_schema.columns where table_name=\''+tableID+'\'') // query
        .then(recordset => {
            console.log("Success");
            res.status(200).send(recordset); // send records as a response
        }).catch(err => {
            console.log(err);
            res.status(500).send(err);
        });
};