const dotenv = require("dotenv");


dotenv.config({
    path: process.env.NODE_ENV === 'test'? '.env.test' : '.env'
});

// console.log(process.env.NODE)
// console.log(process.env);

// Exports a configuration object for database connection.
module.exports = {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    storage: './__tests__/database.sqlite',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
};
