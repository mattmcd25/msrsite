'use strict';

const express = require('express');
const protect = require('@risingstack/protect');
const path = require('path');
const bodyparser = require('body-parser');
const gen = require('./api/generalActions');
const query = require('./api/queryActions');
const update = require('./api/updateActions');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');

let authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://rwwittenberg.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://msrapitest/',
    issuer: "https://rwwittenberg.auth0.com/",
    algorithms: ['RS256']
});

// ========== Configuration ==========
const app = express(); // server app

app.use(bodyparser.json({
    type: 'application/json',
    extended: false
})); // use bodyparser for JSON

app.use(protect.express.sqlInjection({
    body: true,
    loggerFunction: console.error
})); // use protect for security

app.set("port", process.env.PORT || 3005); // select port based on heroku settings

app.get('/api', (req, res) => { // generic test
    res.send("hello from the api!");
});



// ========== Middleware ==========
let checkTableID = (req, res, next) => {
    let tableID = req.params['table'];

    if(!exports.ALLOWED_TABLES.includes(tableID.toUpperCase())) {
        let err = "Invalid table name/potential SQL injection: " + tableID;
        console.log(err);
        if(res) res.status(403).send(err);
        return;
    }
    next();
};



// ========== General Actions ==========
console.log(authCheck);
app.get('/api/connect', authCheck, gen.connect); // connect to the database
app.get('/api/disconnect', authCheck, gen.disconnect); // disconnect from the database



// ========== Querying Actions ==========

app.get('/api/select*/:table', authCheck, checkTableID, query.selectAll); // select all from a table or view
app.get('/api/colnames/:table', checkTableID, query.getColumns); // get column names from a table or view
app.get('/api/tabnames', authCheck, query.getTables); // get all table names from the db
app.post('/api/query', authCheck, query.advancedQuery); // advanced query



// ========== Update Actions ==========
app.post('/api/insert/:table', authCheck, checkTableID, update.insert); // insert on a table
app.patch('/api/update/:table', authCheck, checkTableID, update.update); // update a table row



// ========== Launching Server ==========
if (process.env.NODE_ENV === "production") { // if production, also host static (client) assets
    app.use(express.static(path.join(__dirname, '..', 'build')));

    app.get('/*', authCheck, function (req, res) {
        res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
    });
}

gen.connect().then(() => { // connect to the database
    query.getTables().then(result => {
        exports.ALLOWED_TABLES = result['recordsets'][0].map(tab => tab.TABLE_NAME);
        console.log(exports.ALLOWED_TABLES);
    }).then(() => {
        app.listen(app.get("port"), () => { // listen on the port
            console.log('Server is running...');
            app.on('close', () => { // on close, disconnect from db
                gen.disconnect().then(() => {
                    console.log('Server is stopped.');
                });
            });
        });
    });
}).catch(err => {
    console.log("your wifi probably sucks lol");
    console.log(err);
});

