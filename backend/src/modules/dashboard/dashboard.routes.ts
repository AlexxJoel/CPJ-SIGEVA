import { Router } from "express";
import { getAmount } from "./dashboard.controller";

const router = Router()

router.post('/dashboard', [], getAmount);

export default router;