import express from "express";
import { authCustomFoodIdInParams, authenticateJWT, authFoodLogIdInParams, authPatientIdInBody, authPatientIdInParams, authPatientIdInQuery, authUser, authUserInBody } from '../middleware/auth.middleware.ts';
import { GetReportDay, GetReportWeek, GetReportCustomTimePeriod } from "../services/report.service.ts";
const router = express.Router();

router.get('/day',authenticateJWT, authPatientIdInQuery, GetReportDay);
router.get('/week',authenticateJWT, authPatientIdInQuery, GetReportWeek);
router.get('/customperiod',authenticateJWT, authPatientIdInQuery, GetReportCustomTimePeriod);

export default router;