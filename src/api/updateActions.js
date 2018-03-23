const sql = require("mssql");
const server = require("../server");

// insert : (request :table) x result => promise
// inserts data from JSON into a specified table
exports.insert = (req, res) => {
    let tableID = req.params['table'];

    console.log("Trying to insert " + Object.keys(req.body) + ":" + Object.values(req.body) + " into " + tableID);
    let cols = '("' + Object.keys(req.body).reduce((acc, cur) => acc + '", "' + cur) + '")';
    let vars = '(' + Object.values(req.body).map(val => varToSQL(val)).reduce((acc, cur) => acc + ', ' + cur) + ')';
    let request = new sql.Request();
    let query = `INSERT INTO ${tableID} ${cols} VALUES ${vars}`;
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

// varToSQL : 'a -> 'a
// puts extra quotes around the value if it is a String
// for use when generating INSERT or UPDATE statements
function varToSQL (val) {
    if(typeof(val) === 'string')
        return '\''+val+'\'';
    else
        return val;
}