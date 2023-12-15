import { Router } from "express";
import { insertLayaway, insertReStock, insertSell } from "./transaction.controller";
import {checkAuth} from "../../config/jwt";

const router = Router();

router.post('/sell', checkAuth([]),[], insertSell);
router.post('/restock', checkAuth([]),[], insertReStock);
router.post('/layaway', checkAuth([]),[], insertLayaway);

export default router;