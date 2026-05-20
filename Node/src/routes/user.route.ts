import express from "express";
import { GetUserById, CreateUser, GetAllUsers, UpdateUser, DeleteUser , CheckUserPassword} from "../services/user.service.ts";

const router = express.Router();

router.post('/create-user', CreateUser);
router.get('/get-by-id/:id', GetUserById);
router.get('/all-users', GetAllUsers);
router.put('/update-user/:id', UpdateUser);
router.delete('/delete-user/:id', DeleteUser);
router.post('/check-password', CheckUserPassword);

export default router;