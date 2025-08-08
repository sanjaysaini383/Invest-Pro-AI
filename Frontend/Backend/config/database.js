const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

let mysqlConnection = null;

// MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// MySQL Connection
const connectMySQL = async () => {
  try {
    mysqlConnection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });
    console.log('✅ MySQL Connected successfully');
    return mysqlConnection;
  } catch (error) {
    console.error('❌ MySQL connection error:', error);
    throw error;
  }
};

const getMySQLConnection = () => mysqlConnection;

module.exports = {
  connectDB,
  connectMySQL,
  getMySQLConnection
};
