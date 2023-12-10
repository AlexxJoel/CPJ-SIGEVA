import { Request, Response } from "express";
import { Transaction } from "./transaction.dtos";
import { saveLayaway, saveReStock, saveSell } from "./transaction.gateway";
import { ResponseApi, validateError } from "../../config/error_codes";

const insertSell = async (req: Request, res: Response) => {
    try {
        const payload = req.body as Transaction;
        const sold = await saveSell(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Product sold',
            data: sold
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const insertReStock = async (req: Request, res: Response) => {
    try {
        const payload = req.body as Transaction;
        const restocked = await saveReStock(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Product re stocked',
            data: restocked
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const insertLayaway = async (req: Request, res: Response) => {
    try {
        const payload = req.body as Transaction;
        const aparted = await saveLayaway(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Product aparted',
            data: aparted
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

export {
    insertSell,
    insertReStock,
    insertLayaway,
}