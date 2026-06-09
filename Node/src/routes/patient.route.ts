import express from "express";
import { authenticateJWT, authUserInBody, authPatientIdInParams, authUser } from '../middleware/auth.middleware.ts';
import { CreatePatient, GetAllPatients, GetPatientById, UpdatePatient, DeletePatient } from '../services/patient.service.ts';

const router = express.Router();

router.post('/create-patient', authenticateJWT, authUserInBody, CreatePatient);
router.get('/all-patients/:id', authenticateJWT, authUser, GetAllPatients);
router.get('/get-by-id/:id', authenticateJWT, authPatientIdInParams, GetPatientById);
router.put('/update-patient/:id', authenticateJWT, authPatientIdInParams, UpdatePatient);
router.delete('/delete-patient/:id', authenticateJWT, authPatientIdInParams, DeletePatient);

export default router;