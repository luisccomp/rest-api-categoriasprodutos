const { Sequelize } = require("sequelize");

const config = require("../config/database");
const Category = require("../models/Category");
const Product = require("../models/Product");


const connection = new Sequelize(config);

Category.init(connection);
Product.init(connection);

Product.associate(connection.models);
Category.associate(connection.models);

module.exports = connection;
