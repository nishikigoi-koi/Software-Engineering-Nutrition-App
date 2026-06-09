import express from "express";
import { authCustomFoodIdInParams, authenticateJWT, authFoodLogIdInParams, authPatientIdInBody, authPatientIdInParams, authPatientIdInQuery, authUser, authUserInBody } from '../middleware/auth.middleware.ts';
import { CreateFoodLog, DeleteFoodLog, GetFoodLogByDateAndPatientId, GetFoodLogByID, GetFoodLogByPatientId, UpdateFoodLog } from "../services/foodLog.service.ts";

const router = express.Router();

router.post('/create',authenticateJWT, authPatientIdInBody, CreateFoodLog);
router.put('/update/:id',authenticateJWT, authFoodLogIdInParams, UpdateFoodLog);
router.delete('/delete/:id',authenticateJWT, authFoodLogIdInParams, DeleteFoodLog);
router.get('/get/:id', authenticateJWT, authFoodLogIdInParams, GetFoodLogByID);
router.get('/getbypatient/:id', authenticateJWT, authPatientIdInParams, GetFoodLogByPatientId);
router.get('/getbypatientanddate', authenticateJWT, authPatientIdInQuery, GetFoodLogByDateAndPatientId);

export default router;