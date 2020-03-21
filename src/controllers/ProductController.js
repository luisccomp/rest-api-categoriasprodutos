const Joi = require('@hapi/joi');
const axios = require('axios');

const Product = require('../models/Product');


const schema = Joi.object({
    name: Joi.string()
        .required(),

    description: Joi.string()
        .required(),

    price: Joi.number()
        .required()
        .precision(2),

    category_id: Joi.number()
        .required()
        .integer()
});

module.exports = {

    /**
     * Create and stores a new product on database. This method requires further authentication from user in order
     * to apply changes on database.
     * @param {*} request 
     * @param {*} response 
     */
    async create(request, response) {
        const { name, description, price, category_id } = request.body;

        const { error, value } = schema.validate({ name, description, price, category_id });

        if (error)
            return response
                .status(400)
                .json({
                    message: 'Bad request',
                    details: {
                        error,
                        value
                    }
                });

        const product = await Product.create({
            name,
            description,
            price,
            category_id
        });

        return response
            .status(201)
            .json({
                message: 'Product created',
                details: {
                    product
                }
            });
    },

    /**
     * Delete a product stored on database. In order to perform this action, a user must be authenticated to change
     * database state.
     * @param {*} request 
     * @param {*} response 
     */
    async delete(request, response) {
        const { id } = request.params;

        const product = await Product.findByPk(id);

        if (!product)
            return response
                .status(200)
                .json({
                    message: 'Product not found'
                });

        await Product.destroy({
            where: {
                id
            }
        });

        return response
            .status(200)
            .json({
                message: 'Product removed',
                details: {
                    product
                }
            });
    },

    /**
     * List all products stored on database. This method doesn't require authentication.
     * @param {*} request 
     * @param {*} response 
     */
    async index(request, response) {
        return response
            .status(200)
            .json(await Product.findAll({
                include: [
                    { association: 'product_category' }
                ]
            }));
    },

    /**
     * Retruns detailed information about a product stored on database. This method doesn't require authentication.
     * @param {*} request 
     * @param {*} response 
     */
    async details(request, response) {
        const { id } = request.params;

        const product = await Product.findByPk(id, {
            include: [
                { association: 'product_category' }
            ]
        });

        if (!product)
            return response
                .status(404)
                .json({
                    message: 'Product not found'
                });

        return response
            .status(200)
            .json(product);
    },

    /**
     * Update information about a product. This method requires authentication since it changes database current state.
     * @param {*} request 
     * @param {*} response 
     */
    async update(request, response) {
        const { id } = request.params;
        const { name, description, price, category_id } = request.body;

        const product = await Product.findByPk(id);

        if (!product)
            return response
                .status(404)
                .json({
                    message: 'Product not found'
                });

        await Product.update({
            name,
            description,
            price,
            category_id
        }, {
            where: {
                id
            }
        });

        return response
            .status(200)
            .json({
                message: 'Product updated',
                details: product
            });
    }
};
