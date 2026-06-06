import express from "express";
import { GetUserById, CreateUser, GetAllUsers, UpdateUser, DeleteUser , LoginUser} from "../services/user.service.ts";
import { authenticateJWT, authUser } from '../middleware/auth.middleware.ts';

const router = express.Router();

router.post('/create-user', CreateUser);
router.get('/get-by-id/:id', authenticateJWT, authUser, GetUserById);
router.get('/all-users', authenticateJWT, GetAllUsers);
router.put('/update-user/:id', authenticateJWT, authUser, UpdateUser);
router.delete('/delete-user/:id', authenticateJWT, authUser, DeleteUser);
router.post('/login', LoginUser);

export default router;