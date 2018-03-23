const express = require('express');
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
app.get('/api/colnames/:table', query.getColumns); // get column names from a table or view
app.get('/api/tabnames', query.getTables); // get all table names from the db



// ========== Launching Server ==========
if (process.env.NODE_ENV === "production") { // if production, also host static (client) assets
    app.use(express.static('build'));
    app.get('/*', function (req, res) {
        res.sendFile('build/index.html');
    });
}

gen.connect().then(() => { // connect to the database
    query.getTables().then(result => {
        exports.ALLOWED_TABLES = result['recordsets'][0].map(tab => tab.table_name);
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
});