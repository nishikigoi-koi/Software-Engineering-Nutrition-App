import express from "express";
import { authenticateJWT, authPatientIdInBody, authPatientIdInParams } from '../middleware/auth.middleware.ts';
import { CreatemedicalCondition, GetAllmedicalConditions, GetmedicalConditionById, UpdatemedicalCondition, DeletemedicalCondition, assignmedicalConditionToPatient, removemedicalConditionFromPatient, getPatientmedicalConditions} from '../services/medicalCondition.service.ts';

const router = express.Router();

router.post('/create-medical-Condition', authenticateJWT, CreatemedicalCondition)
router.get('/all-medical-Conditions', GetAllmedicalConditions);
router.get('/get-by-id/:id', GetmedicalConditionById);
router.put('/update-medical-Condition/:id', authenticateJWT, UpdatemedicalCondition);
router.delete('/delete-medical-Condition/:id', authenticateJWT, DeletemedicalCondition);


router.post('/assign-to-patient', authenticateJWT, authPatientIdInBody, assignmedicalConditionToPatient);
router.delete('/remove-from-patient', authenticateJWT, authPatientIdInBody, removemedicalConditionFromPatient);
router.get('/patient-medical-Conditions/:id', authenticateJWT, authPatientIdInParams, getPatientmedicalConditions);

export default router;