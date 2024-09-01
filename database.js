const mysql = require("mysql");


const connection = mysql.createConnection({
    host: 'localhost',
    database: 'mydb',
    user: 'root',
    password: 'password',
});
connection.connect((err)=>{
    if(err) throw err;
    console.log('connected to MySQL database.');
});

module.exports = connection;