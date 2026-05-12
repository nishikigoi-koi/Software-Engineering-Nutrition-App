import express from "express";
import { GetUserById, CreateUser, GetAllUsers, UpdateUser, DeleteUser , CheckUserPassword} from "../services/user.service.ts";

const router = express.Router();

router.post('/', CreateUser);
router.get('/:id', GetUserById);
router.get('/', GetAllUsers);
router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);
router.post('/check-password', CheckUserPassword);

export default router;