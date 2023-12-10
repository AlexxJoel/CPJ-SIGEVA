import { Request, Response } from "express";
import { Errors, ResponseApi, validateError } from "../../config/error_codes";
import { existsById, findAll, findOne, saveSupplier, updateSupplier } from "./supplier.gateway";
import { Supplier } from "./supplier.dtos";

const getOne = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) throw Error(Errors.MISSING_ID);
        if (Number.isNaN(id)) throw Error(Errors.INVALID_FIELDS);
        if (id <= 0) throw Error(Errors.INVALID_FIELDS);
        if (!(await existsById(id))) throw Error(Errors.NOT_FOUND);

        const supplier = await findOne(id);

        const body: ResponseApi<Supplier> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: supplier,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const supplier = await findAll();
        const body: ResponseApi<Supplier[]> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: supplier,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const save = async (req: Request, res: Response) => {
    try {
        const payload = req.body as Supplier;

        if (!payload.contact ||
            !payload.person ||
            !payload.person.name ||
            !payload.person.surname) throw Error(Errors.MISSING_FIELDS);

        const saved = await saveSupplier(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Supplier saved',
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
        const payload = req.body as Supplier;

        if (!payload.id) throw Error(Errors.MISSING_ID);

        if (payload.id < 0 ||
            Number.isNaN(payload.id)) throw Error(Errors.INVALID_FIELDS);

        if (!(await existsById(payload.id))) throw Error(Errors.NOT_FOUND);

        if (!payload.contact ||
            !payload.person ||
            !payload.person.id ||
            Number.isNaN(payload.person.id) ||
            payload.person.id < 0 ||
            !payload.person.name ||
            !payload.person.surname) throw Error(Errors.MISSING_FIELDS);

        const updated = await updateSupplier(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Supplier updated',
            data: updated
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
    update
}