const sql = require("mssql");

// selectAll : returns all data from a specified table
exports.selectAll = (req, res) => {
    let tableID = req.params['table'];


    // create Request object
    let request = new sql.Request();
    // query to the database and get the records
    request.query('select * from '+tableID, (err, recordset) => {

        if (err) console.log(err);

        // send records as a response
        res.send(recordset);

    });
}