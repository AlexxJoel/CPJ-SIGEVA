import { Router } from "express";
import { changeStatus, getAll, getOne, save, update } from "./staff.controller";
import {checkAuth} from "../../config/jwt";

const router = Router();

router.get('/pageable/staff', checkAuth([]),[], getAll);
router.get('/staff/:id', checkAuth([]),[], getOne);
router.post('/staff', checkAuth([]),[], save);
router.put('/staff', checkAuth([]),[], update);
router.delete('/staff/:id', checkAuth([]),[], changeStatus);

export default router;