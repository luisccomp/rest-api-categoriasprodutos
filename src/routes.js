const { Router } = require("express");

const CategoryController = require("./controllers/CategoryController");
const ProductController = require("./controllers/ProductController");


const routes = Router();

routes.post("/categories", CategoryController.create);
routes.delete("/categories/:id", CategoryController.delete);
routes.get("/categories", CategoryController.index);
routes.get("/categories/:id", CategoryController.details);
routes.put("/categories/:id", CategoryController.update);

routes.post("/products", ProductController.create);
routes.delete("/products/:id", ProductController.delete);
routes.get("/products", ProductController.index);
routes.get("/products/:id", ProductController.details);
routes.put("/products/:id", ProductController.update);

module.exports = routes;
