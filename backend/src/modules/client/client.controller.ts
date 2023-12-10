import { Request, Response } from "express";
import { Errors, ResponseApi, validateError } from "../../config/error_codes";
import { existsByEmail, existsById, findAll, saveClient, updateClient } from "./client.gateway";
import { Client } from "./client.dtos";

const getAll =async (req: Request, res: Response) => {
    try {
        const clients = await findAll();
        const body: ResponseApi<Client[]>={
            code: 200,
            error: false,
            message: 'Ok',
            data: clients,
        }
        return res.status(body.code).json(body)
    } catch (error) {
       const errorBody = validateError(error as Error);
       return res.status(errorBody.code).json(errorBody); 
    }
}

const save = async (req: Request, res: Response) => {

    try {
        const payload = req.body as Client;
        if (!payload.email ||
            !payload.person || 
            !payload.person.lastname || 
            !payload.person.name) throw Error(Errors.MISSING_FIELDS);
        if (await existsByEmail(payload.email)) throw Error(Errors.ALREADY_EXISTS);
        const save = await saveClient(payload);
        const body: ResponseApi<boolean>={
            code: 200,
            error: false,
            message: 'client save',
            data: save
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }

}

const update = async (req: Request, res: Response) => {

    try {
        const payload = req.body as Client;
        
        if (!payload.id) throw Error(Errors.MISSING_ID);
        if (payload.id < 0 ||
            Number.isNaN(payload.id)) throw Error(Errors.INVALID_FIELDS);
        if (!(await existsById(payload.id))) throw Error(Errors.NOT_FOUND);
        if (!payload.person.lastname || 
            !payload.person.name ||
            !payload.email ||
            !payload.person || 
            !payload.person.id ||
            Number.isNaN(payload.person.id) ||
            payload.person.id < 0) throw Error(Errors.MISSING_FIELDS);
        const update = await updateClient(payload);
        const body: ResponseApi<boolean>={
            code: 200,
            error: false,
            message: 'client update',
            data: update
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }

}


export {
    getAll,
    save,
    update
}