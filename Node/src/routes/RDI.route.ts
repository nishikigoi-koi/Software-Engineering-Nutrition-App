import express from "express";
import { authCustomFoodIdInParams, authenticateJWT, authFoodLogIdInParams, authPatientIdInBody, authPatientIdInParams, authPatientIdInQuery, authUser, authUserInBody } from '../middleware/auth.middleware.ts';
import { RDICalculator } from "../services/RDI.service.ts";
const router = express.Router();

router.get('/:id',authenticateJWT, authPatientIdInParams, RDICalculator);

export default router;