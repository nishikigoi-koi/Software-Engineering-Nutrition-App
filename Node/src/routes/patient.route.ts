import express from "express";
import { authenticateJWT, authCreatePatient, authPatientIdInBody, authUser } from '../middleware/auth.middleware.ts';
import { CreatePatient, GetAllPatients, GetPatientById, UpdatePatient, DeletePatient } from '../services/patient.service.ts';

const router = express.Router();

router.post('/create-patient', authenticateJWT, authCreatePatient, CreatePatient);
router.get('/all-patients/:id', authenticateJWT, authUser, GetAllPatients);
router.get('/get-by-id/:id', authenticateJWT, authPatientIdInBody, GetPatientById);
router.put('/update-patient/:id', authenticateJWT, authPatientIdInBody, UpdatePatient);
router.delete('/delete-patient/:id', authenticateJWT, authPatientIdInBody, DeletePatient);

export default router;