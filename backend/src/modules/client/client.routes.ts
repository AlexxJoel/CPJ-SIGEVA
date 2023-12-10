import { Router } from "express";
import { getAll, save, update } from "./client.controller";

const router = Router();

router.get('/clients/', [], getAll);
router.post('/clients/', [], save);
router.put('/clients/', [], update);


export default router