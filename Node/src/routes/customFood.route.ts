import express from "express";
import { authCustomFoodIdInParams, authenticateJWT, authPatientIdInBody, authPatientIdInParams, authUser, authUserInBody } from '../middleware/auth.middleware.ts';
import { CreateCustomeFood, DeleteCustomFood, GetCustomFoodById, GetCustomFoodByUserId, UpdateCustomFood } from "../services/customFood.service.ts";

const router = express.Router();

router.post('/create',authenticateJWT, authUserInBody, CreateCustomeFood);
router.put('/update/:id',authenticateJWT, authCustomFoodIdInParams, UpdateCustomFood);
router.delete('/delete/:id',authenticateJWT, authCustomFoodIdInParams, DeleteCustomFood);
router.get('/get/:id', authenticateJWT, authCustomFoodIdInParams, GetCustomFoodById);
router.get('/getbyuserid/:id', authenticateJWT, authUser, GetCustomFoodByUserId);

export default router;