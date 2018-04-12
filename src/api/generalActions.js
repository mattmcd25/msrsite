const sql = require("mssql");

// config for the database
const config = {
    user: 'msrtest',
    password: 'msr2018!',
    server: 'den1.mssql4.gear.host',
    database: 'msrtest'
};

// connect : request x result => (promise connectionpool)
// connects to the database
exports.connect = (req, res) => {
    console.log("[general] Connecting...");
    return sql.connect(config)
        .then(conn => {
            console.log("[general] Success");
            if(res) res.status(200).send("Successfully connected to database.");
            return conn;
        })
        .catch(err => {
            console.log('[general] '+err);
            if(res) res.status(500).send(err);
        });
};

// disconnect : request x result => (promise)
// disconnects from the database
exports.disconnect = (req, res) => {
    console.log("[general] Disconnecting...");
    return sql.close()
        .then(() => {
            console.log("[general] Success");
            if(res) res.status(200).send("Successfully disconnected from database.");
        }).catch(err => {
            console.log('[general] '+err);
            if(res) res.status(500).send(err);
        });
};