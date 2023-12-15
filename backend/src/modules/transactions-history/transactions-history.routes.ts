import { Router } from "express";
import { getHistory } from "./transactions-history.controller";
import {checkAuth} from "../../config/jwt";

const router = Router();

router.get('/transactions-history', checkAuth([]),[], getHistory);

export default router;