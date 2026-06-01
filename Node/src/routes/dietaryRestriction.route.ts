import express from "express";
import { authenticateJWT } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.post('/create-dietary-restriction', authenticateJWT, CreateDietaryRestriction)
router.get('/all-dietary-restrictions', GetAllDietaryRestrictions);
router.get('/get-dietary-restriction-by-id/:id', GetDietaryRestrictionById);
router.put('/update-dietary-restriction/:id', authenticateJWT, UpdateDietaryRestriction);
router.delete('/delete-dietary-restriction/:id', authenticateJWT, DeleteDietaryRestriction);

export default router;