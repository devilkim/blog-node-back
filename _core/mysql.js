'use strict';
const mysql2 = require('mysql2/promise');
let _config = null;
let _pool = null;
let _conn = null;

// module.exports = mysql;
module.exports = {
	extractConifg: (env) => {
		const config = {
			host: env.DB_HOST,
			user: env.DB_USER,
			password: env.DB_PASSWORD,
			database: env.DB_DATABASE,
			port: env.DB_PORT || 3306,
			waitForConnections: env.DB_WAIT_FOR_CONNECTIONS || true,
			connectionLimit: env.DB_CONNECTION_LIMIT || 50,
			queueLimit: env.DB_QUEUE_LIMIT || 50
		};	
		return config;
	},
	config: (config) => {    
		_config = config;
	},	
	release: async (data, req, res, next) => {    
		if (_conn !== null) {
			_conn.release();
		}
		next(data);
	},    
	conn: async () => {
		if (_config === null) {
			return null;
		}
		if (_pool === null) {
			_pool = mysql2.createPool(_config);
		}
		if (_conn === null) {
			_conn = await _pool.getConnection();
		}
		return _conn;
	}
};