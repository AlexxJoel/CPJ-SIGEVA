import { Router } from "express";
import {  getAll, getOne, save, update } from "./supplier.controller";
import {checkAuth} from "../../config/jwt";

const router = Router();

router.get('/pageable/supplier', checkAuth([]),[], getAll);
router.get('/supplier/:id', checkAuth([]),[], getOne);
router.post('/supplier', checkAuth([]),[], save);
router.put('/supplier', checkAuth([]),[], update);

export default router;