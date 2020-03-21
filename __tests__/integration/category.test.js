const connection = require("../../src/database");

const Category = require("../../src/models/Category");


describe('API tests', () => {

    // Testing database operations over category model
    it('Should return the entity itself on success', async () => {
        const category = await Category.create({
            description: 'Electronics and informatics'
        });

        expect(category.description).toBe('Electronics and informatics');
    });
});
