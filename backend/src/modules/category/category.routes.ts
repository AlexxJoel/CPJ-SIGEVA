import { Router } from "express";
import { changeStatus, getAll, getOne, save, update } from "./category.controller";
import {checkAuth} from "../../config/jwt";

const router = Router();

router.get('/pageable/category', checkAuth([]),[], getAll);
router.get('/category/:id', checkAuth([]),[], getOne);
router.post('/category',checkAuth([]), [], save);
router.put('/category',checkAuth([]), [], update);
router.delete('/category/:id',checkAuth([]), [], changeStatus);

export default router;