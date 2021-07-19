const Pool = require("pg").Pool;
require("dotenv").config();

const devConfig = {
    user: process.env.User,
    password: process.env.Password,
    host: process.env.Host,
    database:process.env.Database,
    port:process.env.Port
}

const proConfig = {
    connectionString : process.env.DATABASE_URL
}
const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

module.exports = pool;