import { Request, Response } from "express";
import { Errors, ResponseApi, validateError } from "../../config/error_codes";
import { changeUserStatus, existsById, findAll, findOne } from "./user.gateway";
import { User } from "./user.dtos";

const getOne = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) throw Error(Errors.MISSING_ID);
        if (Number.isNaN(id)) throw Error(Errors.INVALID_FIELDS);
        if (id <= 0) throw Error(Errors.INVALID_FIELDS);
        if (!(await existsById(id))) throw Error(Errors.NOT_FOUND);

        const user = await findOne(id);

        const body: ResponseApi<User> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: user,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const users = await findAll();
        const body: ResponseApi<User[]> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: users,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const changeStatus = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) throw Error(Errors.MISSING_ID);
        if (Number.isNaN(id)) throw Error(Errors.INVALID_FIELDS);
        if (id <= 0) throw Error(Errors.INVALID_FIELDS);
        if (!(await existsById(id))) throw Error(Errors.NOT_FOUND);

        const statusUpdated = await changeUserStatus(id);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'User status updated',
            data: statusUpdated
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

export {
    getOne,
    getAll,
    changeStatus
}