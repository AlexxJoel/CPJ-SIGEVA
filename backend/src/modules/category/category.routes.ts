import { Router } from "express";
import { changeStatus, getAll, getOne, save, update } from "./category.controller";

const router = Router();

router.get('/pageable/category', [], getAll);
router.get('/category/:id', [], getOne);
router.post('/category', [], save);
router.put('/category', [], update);
router.delete('/category/:id', [], changeStatus);

export default router;