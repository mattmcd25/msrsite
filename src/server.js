const express = require('express');
const path = require('path');
const sql = require("mssql");
const gen = require('./api/generalActions');
const query = require('./api/queryActions');

// ========== Configuration ==========
const app = express(); // server app
app.set("port", process.env.PORT || 3005); // select port based on heroku settings

app.get('/api', (req, res) => { // generic test
    res.send("hello from the api!");
});



// ========== General Actions ==========
app.get('/api/connect', gen.connect); // connect to the database
app.get('/api/disconnect', gen.disconnect); // disconnect from the database



// ========== Querying Actions ==========
app.get('/api/select*/:table', query.selectAll); // select all from a table or view



// ========== Launching Server ==========
if (process.env.NODE_ENV === "production") { // if production, also host static (client) assets
    app.use(express.static('build'));
    app.get('/*', function (req, res) {
        res.sendFile('build/index.html');
    });
}

app.listen(app.get("port"), () => { // listen on the port
    console.log('Server is running..');
});