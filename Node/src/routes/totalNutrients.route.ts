import express from "express";
import { authCustomFoodIdInParams, authenticateJWT, authFoodLogIdInParams, authPatientIdInBody, authPatientIdInParams, authPatientIdInQuery, authUser, authUserInBody } from '../middleware/auth.middleware.ts';
import {GetTotalNutrientsDay, GetTotalNutrientsWeek, GetTotalNutrientsCustomTimePeriod } from "../services/totalNutrients.service.ts";
const router = express.Router();

router.get('/day',authenticateJWT, authPatientIdInQuery, GetTotalNutrientsDay);
router.get('/week',authenticateJWT, authPatientIdInQuery, GetTotalNutrientsWeek);
router.get('/customperiod',authenticateJWT, authPatientIdInQuery, GetTotalNutrientsCustomTimePeriod);

export default router;