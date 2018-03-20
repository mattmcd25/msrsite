const sql = require("mssql");

// selectAll : returns all data from a specified table
exports.selectAll = (req, res) => {
    let tableID = req.params['table'];

    console.log("Trying to select * from " + tableID);
    // create Request object
    let request = new sql.Request();
    // query to the database and get the records
    request.query('select * from '+tableID, (err, recordset) => {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            console.log("Success");
            // send records as a response
            res.status(200).send(recordset);
        }
    });
}

// getColumns : returns the column names from a specified table
exports.getColumns = (req, res) => {
    let tableID = req.params['table'];

    console.log("Trying to get column names for " + tableID);
    // create Request object
    let request = new sql.Request();
    // query to the database and get the records
    request.query('select column_name from information_schema.columns where table_name=\''+tableID+'\'', (err, recordset) => {

        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            console.log("Success");
            // send records as a response
            res.status(200).send(recordset);
        }
    });
}