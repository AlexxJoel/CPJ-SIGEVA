import { Router } from "express";
import { changeStatus, getAll, getOne, save, update } from "./product.controller";

const router = Router();

router.post('/pageable/product', [], getAll)
router.get('/product/:id', [], getOne)
router.post('/product', [], save)
router.put('/product', [], update)
router.delete('/product/:id', [], changeStatus)

export default router