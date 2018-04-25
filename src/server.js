'use strict';

const auth0Calls = require("./api/serverAuth");
const express = require('express');
const protect = require('@risingstack/protect');
const path = require('path');
const bodyparser = require('body-parser');
const gen = require('./api/generalActions');
const query = require('./api/queryActions');
const update = require('./api/updateActions');
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');



// ========== Constants ==========
const TABLE_REBINDINGS = {
    'MEMBER': 'MEMBER_RESTRICTED'
};

const AUTH_LEVELS = ['newUser', 'user', 'admin', 'creator'];



// ========== Middleware ==========
const checkTableID = (req, res, next) => {
    let tableID = req.params['table'];

    if(!exports.ALLOWED_TABLES.includes(tableID.toUpperCase())) {
        let err = "Invalid table name/potential SQL injection: " + tableID;
        console.log(err);
        if(res) res.status(403).send(err);
        return;
    }
    next();
};

const restrictTableID = (req, res, next) => {
    let tableID = req.params['table'].toUpperCase();

    if(!exports.ALLOWED_TABLES.includes(tableID.toUpperCase())) {
        let err = "Invalid table name/potential SQL injection: " + tableID;
        console.log(err);
        if(res) res.status(403).send(err);
        return;
    }

    if(Object.keys(TABLE_REBINDINGS).includes(tableID))
        req.params['table'] = TABLE_REBINDINGS[tableID];
    next();
};

const validate = (level) =>
    (req, res, next) => {
        let u = req.user['sub'];
        auth0Calls.getLevel(u).then(user_level => {
            if(AUTH_LEVELS.indexOf(user_level) >= AUTH_LEVELS.indexOf(level)) {
                console.log('[middleware] Accepted user level: ' + user_level);
                next();
            }
            else {
                console.log('[middleware] Insufficient user level: ' + user_level);
                res.sendStatus(401);
            }
        });
    };

const authCheck = jwt({
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
    console.log(req.user);
});



// ========== General Actions ==========
app.get('/api/connect', authCheck, validate('admin'), gen.connect); // connect to the database
app.get('/api/disconnect', authCheck, validate('admin'), gen.disconnect); // disconnect from the database



// ========== Querying Actions ==========
app.get('/api/select*/:table', authCheck, validate('admin'), checkTableID, query.selectAll); // select all from a table or view
app.get('/api/colnames/:table', authCheck, validate('admin'), checkTableID, query.getColumns); // get column names from a table or view
app.get('/api/tabnames', authCheck, validate('admin'), query.getTables); // get all table names from the db
app.post('/api/query/:table', authCheck, validate('admin'), checkTableID, query.advancedQuery); // advanced query
app.get('/api/fks/:table', authCheck, validate('admin'), checkTableID, query.getFKs); // get foreign keys



// ========== Restricted Actions ==========
app.get('/api/limselect/:table', authCheck, validate('user'), restrictTableID, query.selectAll); // select all from a table or view
app.post('/api/limquery/:table', authCheck, validate('user'), restrictTableID, query.advancedQuery); // advanced query
app.get('/api/limcolnames/:table', authCheck, validate('user'), restrictTableID, query.getColumns); // get column names from a table or view
app.get('/api/limfks/:table', authCheck, validate('user'), restrictTableID, query.getFKs); // get foreign keys



// ========== Update Actions ==========
app.post('/api/insert/:table', authCheck, validate('admin'), checkTableID, update.insert); // insert on a table
app.patch('/api/update/:table', authCheck, validate('admin'), checkTableID, update.update); // update a table row
app.delete('/api/delete/:table', authCheck, validate('admin'), checkTableID, update.delete); // delete a table row



// ========== Auth Actions ==========
app.get('/api/users', authCheck, validate('admin'), auth0Calls.getUsers);
app.patch('/api/saveuser', authCheck, validate('admin'), auth0Calls.updateUser);
app.get('/api/getperms', authCheck, auth0Calls.getPerms);



// ========== Launching Server ==========
if (process.env.NODE_ENV === "production") { // if production, also host static (client) assets
    app.use(express.static(path.join(__dirname, '..', 'build')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
    });
}

gen.connect().then(() => {
    // connect to the database
    query.getTables().then(result => {
        exports.ALLOWED_TABLES = result['recordsets'][0].map(tab => tab.TABLE_NAME);
        console.log(exports.ALLOWED_TABLES);
    }).then(() => {
        app.listen(app.get("port"), () => { // listen on the port
            console.log('[general] Server is running...');
            app.on('close', () => { // on close, disconnect from db
                gen.disconnect().then(() => {
                    console.log('[general] Server is stopped.');
                });
            });
        });
    });
}).catch(err => {
    console.log("[general] your wifi probably sucks lol");
    console.log(err);
});

