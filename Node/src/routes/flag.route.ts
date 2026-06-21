import express from "express";
import { authCustomFoodIdInParams, authenticateJWT, authFoodLogIdInParams, authPatientIdInBody, authPatientIdInParams, authPatientIdInQuery, authUser, authUserInBody } from '../middleware/auth.middleware.ts';
import { GetFlagsDay, GetFlagsWeek,GetFlagsCustomTimePeriod } from "../services/flag.service.ts";
const router = express.Router();

router.get('/day',authenticateJWT, authPatientIdInQuery, GetFlagsDay);
router.get('/week',authenticateJWT, authPatientIdInQuery, GetFlagsWeek);
router.get('/customperiod',authenticateJWT, authPatientIdInQuery, GetFlagsCustomTimePeriod);

export default router;