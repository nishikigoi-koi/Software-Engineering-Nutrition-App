import express from "express";
import { authCustomFoodIdInParams, authenticateJWT, authFoodLogIdInParams, authPatientIdInBody, authPatientIdInParams, authPatientIdInQuery, authUser, authUserInBody } from '../middleware/auth.middleware.ts';
import { SearchFoodFileAndCustom, SearchGetCustom, SearchGetFoodFile } from "../services/search.service.ts";
const router = express.Router();

router.get('/foodfile/:id', authenticateJWT, SearchGetFoodFile);
router.get('/customfood/:id', authenticateJWT, authCustomFoodIdInParams, SearchGetCustom);

export default router;