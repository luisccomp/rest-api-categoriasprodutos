const Joi = require("@hapi/joi");
const axios = require("axios");

const Category = require("../models/Category");


const schema = Joi.object({
    description: Joi.string()
        .required()
});

module.exports = {

    /**
     * Create a new category and stores it on database. This method requires further authentication in order to add
     * new categories on database.
     * @param {*} request 
     * @param {*} response 
     */
    async create(request, response) {
        const token = request.get('auth-token');

        if (!token)
            return response
                .status(400)
                .json({
                    message: 'Authentication required'
                });

        axios.get('http://localhost:5000/auth', { headers: { 'auth-token': token } })
            .then(async apiResponse => {
                // console.log('OK');

                // return response
                //     .status(200)
                //     .json({
                //         message: 'Authenticated'
                //     });

                const { description } =  request.body;

                const { error, value } = schema.validate({ description });

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

                const category = await Category.create({ description });

                return response
                    .status(201)
                    .json(category);
            })
            .catch(async err => {
                // console.log('Error:', err.config);

                // return response
                //     .status(400)
                //     .json({
                //         message: 'Bad request'
                //     });

                return response
                    .status(err.response.status)
                    .json({
                        message: err.response.data.message
                    })
            });

        // const apiResponse = await axios.get('http://localhost:5000/auth');

        // if (apiResponse.status === 403)
        //     return response
        //         .status(403)
        //         .json({
        //             message: 'Unauthorized'
        //         });

        // else if (apiResponse.status === 400)
        //     return response
        //         .status(400)
        //         .json({
        //             message: apiResponse.message
        //         });


        /*
         * try {
         *     const apiResponse = await axios.get('http://localhost:5000/auth');
         * }
         * catch (error) {
         *     console.log('Error:', error);
         *
         *     return response
         *         .status(400)
         *         .json({
         *             message: 'Something went wrong'
         *         });
         * }
         *
         * const { error, value } = schema.validate({ description });
         *
         * console.log('Cascudo');
         *
         * if (error)
         *     return response
         *         .status(400)
         *         .json({
         *             message: "Field description is required",
         *             details: {
         *                 error,
         *                 value
         *             }
         *         });
         *
         * const category = await Category.create({ description });
         * 
         * return response
         *     .status(201)
         *     .json({
         *         message: "Category created",
         *         details: {
         *             category
         *         }
         *     });
         */
    },

    /**
     * Delete a category stored on database and return the deleted category. This method needs further authentication
     * in order to delete a category.
     * @param {*} request 
     * @param {*} response 
     */
    async delete(request, response) {
        const token = request.get('auth-token');

        if (!token)
            return response
                .status(400)
                .json({
                    message: 'Authentication required'
                });

        axios.get('http://localhost:5000/auth', { headers: { 'auth-token': token } })
            .then(async apiResponse => {
                const { id } = request.params;

                const category = await Category.findByPk(id);

                if (!category)
                    return response
                        .status(404)
                        .json({
                            message: 'Category not found'
                        });

                await Category.destroy({
                    where: {
                        id
                    }
                });

                return response
                    .status(200)
                    .json(category);
            })
            .catch(async err => {
                console.log('Error:', err);

                return response
                    .status(err.response.status)
                    .json({
                        message: err.response.data.message
                    });
            });

        // const { id } = request.params;

        // const category = Category.findByPk({ id });
        // const category = await Category.findByPk(id);

        // if (!category)
        //     return response
        //         .status(200)
        //         .json({
        //             message: "Category not found"
        //         });

        // await Category.destroy({ 
        //     where: { 
        //         id 
        //     } 
        // });

        // return response
        //     .status(200)
        //     .json({
        //         // message: "Category deleted",
        //         // details: {
        //         //     category
        //         // }
        //         category
        //     });
    },

    /**
     * List all categories stored on database. This method doesn't require any authentication since it doesn't change
     * database state.
     * @param {*} request 
     * @param {*} response 
     */
    async index(request, response) {
        return response
            .status(200)
            .json(await Category.findAll({
                include: [
                    { association: 'products' }
                ]
            }));
    },

    /**
     * Return information about a category given it's ID. This method doesn't require any further authentication.
     * @param {*} request 
     * @param {*} response 
     */
    async details(request, response) {
        const { id } = request.params;

        const category = await Category.findByPk(id, {
            include: [
                { association: 'products' }
            ]
        });

        if (!category)
            return response
                .status(404)
                .json({
                    message: "Category not found"
                });

        return response
            .status(200)
            .json(category);
    },

    /**
     * Update data of a existing category stored on database. This method requires further authentication in order to
     * make changes on database.
     * @param {*} request 
     * @param {*} response 
     */
    async update(request, response) {
        const token = request.get('auth-token');

        if (!token)
            return response
                .status(400)
                .json({
                    message: 'Authentication required'
                });

        axios.get('http://localhost:5000/auth', { headers: { 'auth-token': token } })
            .then(async apiResponse => {
                const { id } = request.params;
                const { description } = request.body;

                const { error, value } = schema.validate({ description });

                if (error)
                    return response
                        .status(400)
                        .json({
                            message: 'Description field is required',
                            details: {
                                error,
                                value
                            }
                        });

                const category = await Category.findByPk(id);

                if (!category)
                    return response
                        .status(404)
                        .json({
                            message: 'Category not found'
                        });

                await Category.update({ description }, { where: { id }});

                return response
                    .status(200)
                    .json(category);
            })
            .catch(async error => {
                console.log('Error:', error);

                return response
                    .status(error.response.status)
                    .json({
                        message: error.response.data.message
                    });
            });

        // const { id } = request.params;
        // const { description } = request.body;

        // const { error, value } = schema.validate({ description });

        // if (error)
        //     return response
        //         .status(400)
        //         .json({
        //             message: "Description field is required",
        //             details: {
        //                 error,
        //                 value
        //             }
        //         });


        // const category = await Category.findByPk(id);

        // if (!category)
        //     return response
        //         .status(200)
        //         .json({
        //             message: "Category not found"
        //         });

        // await Category.update({
        //     description
        // }, {
        //     where: {
        //         id
        //     }
        // });

        // return response
        //     .status(200)
        //     .json({
        //         message: "Category updated"
        //     });
    }
};
