import express from "express";
import { GetUserById, CreateUser, GetAllUsers, UpdateUser, DeleteUser , GetUserByPasswordHash} from "../services/user.service.ts";

const router = express.Router();

router.post('/', CreateUser);
router.get('/:id', GetUserById);
router.get('/', GetAllUsers);
router.put('/:id', UpdateUser);
router.delete('/:id', DeleteUser);

export default router;