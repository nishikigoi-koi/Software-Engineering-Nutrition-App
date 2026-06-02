import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import mainRoute from './routes/main.route.ts';
import userRoute from './routes/user.route.ts';
import patientRoute from './routes/patient.route.ts';
import dietaryRestrictionRoute from './routes/dietaryRestriction.route.ts';
import medicalConditionRoute from './routes/medicalCondition.route.ts';

import "./database/db.connect.ts";

import { handlerError } from './middleware/error.middleware.ts';




dotenv.config({
    path: "./.env",
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cors({ origin: ['*'], credentials: true }));
app.use(cors({origin: '*'}));

app.use('/api', mainRoute);
app.use('/api/users', userRoute);
app.use('/api/patients', patientRoute);
app.use('/api/dietary-restrictions', dietaryRestrictionRoute);
app.use('/api/medical-conditions', medicalConditionRoute);

app.use(handlerError);

const PORT = parseInt(process.env.PORT as string) || 3000;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
