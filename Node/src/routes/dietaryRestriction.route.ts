import express from "express";
import { authenticateJWT, authPatientIdInBody, authPatientIdInParams } from '../middleware/auth.middleware.ts';
import { CreateDietaryRestriction, GetAllDietaryRestrictions, GetDietaryRestrictionById, UpdateDietaryRestriction, DeleteDietaryRestriction, assignDietaryRestrictionToPatient, removeDietaryRestrictionFromPatient, getPatientDietaryRestrictions} from '../services/dietaryRestriction.service.ts';

const router = express.Router();

router.post('/create-dietary-restriction', authenticateJWT, CreateDietaryRestriction)
router.get('/all-dietary-restrictions', GetAllDietaryRestrictions);
router.get('/get-dietary-restriction-by-id/:id', GetDietaryRestrictionById);
router.put('/update-dietary-restriction/:id', authenticateJWT, UpdateDietaryRestriction);
router.delete('/delete-dietary-restriction/:id', authenticateJWT, DeleteDietaryRestriction);


router.post('/assign-to-patient', authenticateJWT, authPatientIdInBody, assignDietaryRestrictionToPatient);
router.post('/remove-from-patient', authenticateJWT, authPatientIdInBody, removeDietaryRestrictionFromPatient);
router.get('/get-patient-dietary-restrictions/:id', authenticateJWT, authPatientIdInParams, getPatientDietaryRestrictions);

export default router;