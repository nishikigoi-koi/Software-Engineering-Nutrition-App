import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mainRoute from './routes/main.route.ts';
import "./database/db.connect.ts";


dotenv.config({
    path: "./.env",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: ['*'], credentials: true }));


app.use('/api', mainRoute);

const PORT = parseInt(process.env.PORT as string) || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
