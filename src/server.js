const express = require('express');
const path = require('path');
const app = express();

app.get('/api', (req, res) => {
    res.send("hello api");
    // var sql = require("mssql");
    //
    // // config for your database
    // var config = {
    //     user: 'msrtest',
    //     password: 'msr2018!',
    //     server: 'den1.mssql4.gear.host',
    //     database: 'msrtest'
    // };
    //
    // // connect to your database
    // sql.connect(config, function (err) {
    //
    //     if (err) console.log(err);
    //
    //     // create Request object
    //     var request = new sql.Request();
    //
    //     // query to the database and get the records
    //     request.query('select * from Member', function (err, recordset) {
    //
    //         if (err) console.log(err)
    //
    //         // send records as a response
    //         res.send(recordset);
    //
    //     });
    // });
});

if (process.env.NODE_ENV === "production") {
    app.use(express.static('build'));

    +app.get('/*', function (req, res) {
        res.sendFile('build/index.html');
    });
}

var server = app.listen(3005, function () {
    console.log('Server is running..');
});