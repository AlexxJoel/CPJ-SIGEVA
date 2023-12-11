import { Router } from "express";
import { getHistory } from "./transactions-history.controller";

const router = Router();

router.get('/transactions-history', [], getHistory);

export default router;