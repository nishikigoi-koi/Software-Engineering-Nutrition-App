import express from "express";
import { authenticateJWT, authCreatePatient, authPatient, authUser } from '../middleware/auth.middleware.ts';
import { CreatePatient, GetAllPatients, GetPatientById, UpdatePatient, DeletePatient } from '../services/patient.service.ts';

const router = express.Router();

router.post('/create-patient', authenticateJWT, authCreatePatient, CreatePatient);
router.get('/all-patients/:id', authenticateJWT, authUser, GetAllPatients);
router.get('/get-by-id/:id', authenticateJWT, authPatient, GetPatientById);
router.put('/update-patient/:id', authenticateJWT, authPatient, UpdatePatient);
router.delete('/delete-patient/:id', authenticateJWT, authPatient, DeletePatient);

export default router;