const Pool = require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password:"!Pppost39123",
    host:"localhost",
    port:5432,
    database:"G4A",

});

module.exports = pool;