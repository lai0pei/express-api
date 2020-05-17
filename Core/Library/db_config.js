let mysql = require('mysql');
let env = require('dotenv').config();



function db_connect() {
	var connection = mysql.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB,
	});
	return connection;
}

exports.db_connect = db_connect;
