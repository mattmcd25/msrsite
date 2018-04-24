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

const validate = (level) =>
    (req, res, next) => {
        let u = req.user['sub'];
        if (auth0Calls.recentUsers.indexOf(u) >= 0) {
            console.log("[middleware] Recent User with ID: " + u);
            next();
        } else {
            auth0Calls.getSysToken().then(() => auth0Calls.getLevel(u)).then(() => {
                console.log("[middleware] user level: " + auth0Calls.userLevelServerSide);
                if (auth0Calls.userLevelServerSide === level || auth0Calls.userLevelServerSide === 'admin') {
                    auth0Calls.recentUsers.push(u);
                    next();
                } else if (level === 'user' && auth0Calls.userLevelServerSide === 'admin') {
                    auth0Calls.recentUsers.push(u);
                    next();
                }else{
                    console.log("Invalid User Level: " + auth0Calls.userLevelServerSide);
                    res.sendStatus(401);
                }
            });
        }
    };

const validateUser = (req, res, next) => {
    let u = req.user['sub'];
    if(auth0Calls.recentUsers.indexOf(u) >= 0){
        console.log("[middleware] Recent User with ID: "+ u);
        next();
    }else{
        auth0Calls.getSysToken().then(() => auth0Calls.getLevel(u)).then(() => {
            console.log("[middleware] user level: " + auth0Calls.userLevelServerSide);
            if(auth0Calls.userLevelServerSide === 'user' || auth0Calls.userLevelServerSide === 'admin') {
                auth0Calls.recentUsers.push(u);
                next();
            }else{
                console.log("Invalid User Level: "+ auth0Calls.userLevelServerSide);
                res.sendStatus(401);
            }
        });

    }


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

// ========== Download Report ==========
app.post('/api/download', function(req, res){
    console.log(req.body);
    let file = req.body;
    res.download(file); // Set disposition and send it.
});



// ========== General Actions ==========
app.get('/api/connect', authCheck, validate('admin'), gen.connect); // connect to the database
app.get('/api/disconnect', authCheck, validate('admin'), gen.disconnect); // disconnect from the database



// ========== Querying Actions ==========
app.get('/api/select*/:table', authCheck, validate('admin'), checkTableID, query.selectAll); // select all from a table or view
app.get('/api/colnames/:table', authCheck, validate('admin'), checkTableID, query.getColumns); // get column names from a table or view
app.get('/api/tabnames', authCheck, validate('admin'), query.getTables); // get all table names from the db
app.post('/api/query/:table', authCheck, validate('admin'), checkTableID, query.advancedQuery); // advanced query



// ========== Update Actions ==========
app.post('/api/insert/:table', authCheck, validate('admin'), checkTableID, update.insert); // insert on a table
app.patch('/api/update/:table', authCheck, validate('admin'), checkTableID, update.update); // update a table row
app.delete('/api/delete/:table', authCheck, validate('admin'), checkTableID, update.delete); // delete a table row


//++++++++++++ Auth Actions ++++++++++++
app.get('/api/users', authCheck, validateUser, auth0Calls.getUsers);
app.patch('/api/saveuser', authCheck, validateUser, auth0Calls.updateUser);


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

