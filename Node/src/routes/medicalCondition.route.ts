import express from "express";
import { authenticateJWT, authPatientIdInBody, authPatientIdInParams } from '../middleware/auth.middleware.ts';
import { CreateMedicalCondition, GetAllMedicalConditions, GetMedicalConditionById, UpdateMedicalCondition, DeleteMedicalCondition, assignMedicalConditionToPatient, removeMedicalConditionFromPatient, getPatientMedicalConditions} from '../services/medicalCondition.service.ts';

const router = express.Router();

router.post('/create-medical-Condition', authenticateJWT, CreateMedicalCondition)
router.get('/all-medical-Conditions', GetAllMedicalConditions);
router.get('/get-by-id/:id', GetMedicalConditionById);
router.put('/update-medical-Condition/:id', authenticateJWT, UpdateMedicalCondition);
router.delete('/delete-medical-Condition/:id', authenticateJWT, DeleteMedicalCondition);


router.post('/assign-to-patient', authenticateJWT, authPatientIdInBody, assignMedicalConditionToPatient);
router.delete('/remove-from-patient', authenticateJWT, authPatientIdInBody, removeMedicalConditionFromPatient);
router.get('/patient-medical-Conditions/:id', authenticateJWT, authPatientIdInParams, getPatientMedicalConditions);

export default router;