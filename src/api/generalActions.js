const sql = require("mssql");

// config for the database
const config = {
    user: 'msrtest',
    password: 'msr2018!',
    server: 'den1.mssql4.gear.host',
    database: 'msrtest'
};

// connect : connects to the database
exports.connect = (req, res) => {
    sql.connect(config, (err) => {
        if (err) console.log(err);
        else res.send("Successfully connected to database.");
    });
}

// disconnect : disconnects from the database
exports.disconnect = (req, res) => {
    sql.close((err) => {
        if (err) console.log(err);
        else res.send("Successfully disconnected from database.");
    });
}