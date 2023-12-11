import { Request, Response } from "express";
import { ResponseApi, validateError } from "../../config/error_codes";
import { findAll } from "./transactions-history.gateway";
import { TransactionHistoryDto } from "./transactions-history.dtos";

const getHistory = async (req: Request, res: Response) => {
    try {
        const history = await findAll();
        const body: ResponseApi<TransactionHistoryDto[]> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: history,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

export {
    getHistory
}