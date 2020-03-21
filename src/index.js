const dotenv = require("dotenv");

const app = require("./app");
const database = require("./database");


dotenv.config({
    path: process.env.NODE_ENV === 'test'? '.env.test' : '.env'
});

// const port = process.env.PORT || 3000;
// 
// app.listen(port, () => {
//     console.log(`Process running at port ${port}`);
// });

database.authenticate()
    .then(() => {
        console.log('Connected to database...');

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`Process running at port ${port}`);
        });
    })
    .catch(err => {
        console.error('Could not connect to database...');
        console.error('Error:', err);
    });
