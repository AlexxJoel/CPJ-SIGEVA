import { Router } from "express";
import { getAll, getOne, save, update } from "./client.controller";
import {checkAuth} from "../../config/jwt";

const router = Router();

router.get('/clients/:id',checkAuth([]), [], getOne);
router.get('/clients/',checkAuth([]), [], getAll);
router.post('/clients/',checkAuth([]), [], save);
router.put('/clients/',checkAuth([]), [], update);


export default router