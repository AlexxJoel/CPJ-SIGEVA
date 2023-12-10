import { Router } from "express";
import {  getAll, getOne, save, update } from "./supplier.controller";

const router = Router();

router.get('/pageable/supplier', [], getAll);
router.get('/supplier/:id', [], getOne);
router.post('/supplier', [], save);
router.put('/supplier', [], update);

export default router;