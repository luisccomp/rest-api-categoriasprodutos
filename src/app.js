const bodyParser = require("body-parser");
const express = require("express");
const cors = require('cors');

const routes = require("./routes");


class App {
    constructor() {
        this.express = express();

        this.middlewares();
        this.routes();
    }

    middlewares() {
        this.express.use(cors());
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
    }

    routes() {
        this.express.use(routes);
    }
}

module.exports = new App().express;
