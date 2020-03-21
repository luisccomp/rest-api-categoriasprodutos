const { Model, DataTypes } = require('sequelize');


class Product extends Model {

    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            description: DataTypes.STRING,
            price: DataTypes.DECIMAL(10,2)
        }, {
            sequelize
        });
    }

    static associate(models) {
        this.belongsTo(models.Category, {
            foreignKey: 'category_id',
            as: 'product_category'
        });
    }
}

module.exports = Product;
