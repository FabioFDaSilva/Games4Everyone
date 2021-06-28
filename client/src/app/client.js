const {Client} = require('pg');

const client = new Client({
  user: "postgres",
  password: "!Pppost39123",
  host:"localhost",
  post: 5432,
  database: "G4A"
});

client.connect()
.then(() => console.log("Connected successfully"))
.catch(e => console.log(e))
.finally(() => client.end());