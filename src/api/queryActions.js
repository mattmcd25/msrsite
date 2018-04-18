const sql = require("mssql");
const ua = require("./updateActions");
// const server = require("../server");

// selectAll : (request :table) x result => promise
// returns all data from a specified table
// SECURITY: tableID checked by my middleware
exports.selectAll = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log(`[select*] ${tableID}`);
    let request = new sql.Request(); // create Request object
    return request.query(`SELECT * FROM `+ tableID) // query
        .then(recordset => {
            console.log("[select*] Success");
            if(res) res.status(200).send(recordset); // send records as a response
        })
        .catch(err => {
            console.log('[select*] 500 '+err);
            if(res) res.status(500).send(err);
        });
};

exports.advancedQuery = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log(`[query] ${tableID} with cond ${JSON.stringify(req.body)}`);
    let cond = Object.keys(req.body).reduce((acc, cur) => {
        let op = (cur === 'LENGTH' || cur === 'YEAR') ? '>=' : '=';
        return `${acc} AND [${cur}]${op}${ua.varToSQL(req.body[cur])}`
    }, '').substring(5);
    let query = `SELECT * FROM "${tableID}" WHERE ${cond}`;
    let request = new sql.Request();
    return request.query(query) // query
        .then(recordset => {
            console.log("[query] Success");
            if(res) res.status(200).send(recordset); // send records as a response
        })
        .catch(err => {
            console.log('[query] 500 '+err);
            if(res) res.status(500).send(err);
        });
};

// getColumns : (request :table) x result => promise
// returns the column names from a specified table
// SECURITY: tableID checked by my middleware
exports.getColumns = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log(`[colnames] ${tableID}`);
    let request = new sql.Request(); // create Request object
    return request.query(`SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${tableID}'`) // query
        .then(recordset => {
            console.log("[colnames] Success");
            if(res) res.status(200).send(recordset); // send records as a response
        }).catch(err => {
            console.log('[colnames] 500 '+err);
            if(res) res.status(500).send(err);
        });
};

// getTables : request x result => promise
// returns the names of all tables in the database
exports.getTables = (req, res) => {
    console.log(`[tabnames] Getting all table names`);
    let request = new sql.Request();
    return request.query(`SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES`)
        .then(recordset => {
            console.log("[tabnames] Success");
            if(res) res.status(200).send(recordset);
            return recordset;
        }).catch(err => {
            console.log('[tabnames] 500 '+err);
            if(res) res.status(500).send(err);
        });
};

// getFKs : requst x result => promise
// returns all of the foreign keys for a given table
exports.getFKs = (req, res) => {
    let tableID = req.params['table'].toUpperCase();

    console.log(`[fks] Getting fks for ${tableID}`);
    let request = new sql.Request();
    let query = `SELECT OBJECT_NAME(f.parent_object_id) FROM sys.foreign_key_columns f WHERE OBJECT_NAME(f.referenced_object_id)='${tableID}'`;
    return request.query(query)
        .then(recordset => {
            console.log("[fks] Success");
            if(res) res.status(200).send(recordset);
        }).catch(err => {
            console.log("[fks] 500 "+err);
            if(res) res.status(500).send(err);
        })
};