import { Router } from "express";
import { changeStatus, getAll, getOne, save, update } from "./product.controller";
import {checkAuth} from "../../config/jwt";

const router = Router();

router.post('/pageable/product', checkAuth([]),[], getAll)
router.get('/product/:id', checkAuth([]),[], getOne)
router.post('/product', checkAuth([]),[], save)
router.put('/product',checkAuth([]), [], update)
router.delete('/product/:id',checkAuth([]), [], changeStatus)

export default router