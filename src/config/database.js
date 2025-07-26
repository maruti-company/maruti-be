const config = {
  development: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'maruti_db',
    username: process.env.DB_USER || 'maruti_user',
    password: process.env.DB_PASSWORD || 'your_password',
    dialect: 'postgres', // or mysql, sqlite, etc.
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  },
  test: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'maruti_test_db',
    username: process.env.DB_USER || 'maruti_user',
    password: process.env.DB_PASSWORD || 'your_password',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,
      min: 5,
      acquire: 30000,
      idle: 10000,
    },
  },
};

module.exports = config; 