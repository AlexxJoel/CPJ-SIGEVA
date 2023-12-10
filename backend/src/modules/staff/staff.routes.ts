import { Router } from "express";
import { changeStatus, getAll, getOne, save, update } from "./staff.controller";

const router = Router();

router.get('/pageable/staff', [], getAll);
router.get('/staff/:id', [], getOne);
router.post('/staff', [], save);
router.put('/staff', [], update);
router.delete('/staff/:id', [], changeStatus);

export default router;