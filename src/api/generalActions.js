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
    console.log("Trying to connect...");
    sql.connect(config, (err) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            console.log("Connected successfully.");
            res.status(200).send("Successfully connected to database.");
        }
    });
}

// disconnect : disconnects from the database
exports.disconnect = (req, res) => {
    console.log("Trying to disconnect...");
    sql.close((err) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }
        else {
            console.log("Disconnected successfully.");
            res.status(200).send("Successfully disconnected from database.");
        }
    });
}