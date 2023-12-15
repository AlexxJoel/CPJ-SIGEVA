import { Request, Response } from "express";
import { Errors, ResponseApi, validateError } from "../../config/error_codes";
import { findAll } from "./dashboard.gateway";
import { Dashboard } from "./dashboard.dtos";

const getAmount = async (req: Request, res: Response) => {
    try {
        const payload = req.body as Dashboard;
        const types = ['days', 'weeks', 'months', 'years'];

        if (!payload ||
            !payload.intervalType ||
            !payload.interval) {
            payload.intervalType = 'days';
            payload.interval = 1;
        }

        if (!types.includes(payload.intervalType.toLowerCase()) ||
            payload.interval <= 0 ||
            Number.isNaN(payload.interval)) throw Error(Errors.INVALID_FIELDS);

        const response = await findAll(payload);
        const body: ResponseApi<any> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: response,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

export {
    getAmount
}