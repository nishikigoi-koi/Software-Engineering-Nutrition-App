import express from 'express';
import dotenv from 'dotenv';

async function start() {

    dotenv.config({
        path: "./.env",
    });

    const app = express();

    app.get('/', (req, res) => {
        res.send('Hello, world!');
    });

    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    });
}

start()