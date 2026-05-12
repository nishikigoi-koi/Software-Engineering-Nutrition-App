import express from "express";
import * as mainService from "../services/main.service.ts";


const router = express.Router();

router.get('/', mainService.sayHello);

export default router;