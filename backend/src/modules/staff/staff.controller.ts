import { Request, Response } from "express";
import { Errors, ResponseApi, validateError } from "../../config/error_codes";
import { changeStaffStatus, existsByEmail, existsById, findAll, findOne, saveStaff, updateStaff } from "./staff.gateway";
import { Staff } from "./staff.dtos";

const getOne = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) throw Error(Errors.MISSING_ID);
        if (Number.isNaN(id)) throw Error(Errors.INVALID_FIELDS);
        if (id <= 0) throw Error(Errors.INVALID_FIELDS);
        if (!(await existsById(id))) throw Error(Errors.NOT_FOUND);

        const staff = await findOne(id);

        const body: ResponseApi<Staff> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: staff,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const staff = await findAll();
        const body: ResponseApi<Staff[]> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: staff,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const save = async (req: Request, res: Response) => {
    try {
        const payload = req.body as Staff;

        if (!payload.birthday ||
            !payload.email ||
            !payload.person ||
            !payload.person.name ||
            !payload.person.surname ||
            !payload.user ||
            !payload.user.username ||
            !payload.user.rolesId) throw Error(Errors.MISSING_FIELDS);
        payload.email = payload.email.trim();
        if (await existsByEmail(payload.email)) throw Error(Errors.ALREADY_EXISTS);
        payload.user.username = payload.user.username.trim()
        if (payload.user.username.length < 3 || payload.user.username.length > 25) throw Error(Errors.INVALID_FIELDS);
        // if

        const saved = await saveStaff(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Staff saved',
            data: saved
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const update = async (req: Request, res: Response) => {
    try {
        const payload = req.body as Staff;

        if (!payload.id) throw Error(Errors.MISSING_ID);

        if (payload.id < 0 ||
            Number.isNaN(payload.id)) throw Error(Errors.INVALID_FIELDS);

        if (!(await existsById(payload.id))) throw Error(Errors.NOT_FOUND);

        if (!payload.birthday ||
            !payload.email ||
            !payload.person ||
            !payload.person.id ||
            Number.isNaN(payload.person.id) ||
            payload.person.id < 0 ||
            !payload.person.name ||
            !payload.person.surname ||
            !payload.user ||
            !payload.user.id ||
            Number.isNaN(payload.user.id) ||
            payload.user.id < 0 ||
            !payload.user.username ||
            !payload.user.password ||
            !payload.user.rolesId) throw Error(Errors.MISSING_FIELDS);
        payload.email = payload.email.trim();
        payload.user.username = payload.user.username.trim()
        if (payload.user.username.length < 3 || payload.user.username.length > 25) throw Error(Errors.INVALID_FIELDS);

        const updated = await updateStaff(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Staff updated',
            data: updated
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

        const statusUpdated = await changeStaffStatus(id);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Staff status updated',
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
    save,
    update,
    changeStatus
}