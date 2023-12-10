import { Router } from "express";
import { changeStatus, getAll, getOne } from "./user.controller";

const router = Router();

router.get('/pageable/user', [], getAll)
router.get('/user/:id', [], getOne)
router.delete('/user/:id', [], changeStatus)

export default router