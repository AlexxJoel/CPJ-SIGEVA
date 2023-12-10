import { Router } from "express";
import { insertLayaway, insertReStock, insertSell } from "./transaction.controller";

const router = Router();

router.post('/sell', [], insertSell);
router.post('/restock', [], insertReStock);
router.post('/layaway', [], insertLayaway);

export default router;