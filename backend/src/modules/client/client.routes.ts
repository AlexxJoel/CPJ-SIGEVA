import { Router } from "express";
import { getAll, getOne, save, update } from "./client.controller";

const router = Router();

router.get('/clients/:id', [], getOne);
router.get('/clients/', [], getAll);
router.post('/clients/', [], save);
router.put('/clients/', [], update);


export default router