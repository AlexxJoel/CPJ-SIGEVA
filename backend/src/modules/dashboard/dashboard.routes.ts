import { Router } from "express";
import { getAmount } from "./dashboard.controller";
import {checkAuth} from "../../config/jwt";

const router = Router()

router.post('/dashboard', checkAuth([]),[], getAmount);

export default router;