import { Request, Response } from "express";
import { Errors, ResponseApi, validateError } from "../../config/error_codes";
import { UpdateCategory, changeCategoryStatus, existsById, existsByName, findAll, findOne, saveCategory } from "./category.gateway";
import { GetCategoryDto, SaveCategoryDto, UpdateCategoryDto } from "./category.dtos";

const getOne = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) throw Error(Errors.MISSING_ID);
        if (Number.isNaN(id)) throw Error(Errors.INVALID_FIELDS);
        if (id <= 0) throw Error(Errors.INVALID_FIELDS);
        if (!(await existsById(id))) throw Error(Errors.NOT_FOUND);

        const category = await findOne(id);

        const body: ResponseApi<GetCategoryDto> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: category,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const categories = await findAll();
        const body: ResponseApi<GetCategoryDto[]> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: categories,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const save = async (req: Request, res: Response) => {
    try {
        const payload = req.body as SaveCategoryDto;

        if (!payload.name ||
            !payload.description) throw Error(Errors.MISSING_FIELDS)

        payload.name = payload.name.trim();

        if (await existsByName(payload.name)) throw Error(Errors.ALREADY_EXISTS);

        const saved = await saveCategory(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Category saved',
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
        const payload = req.body as UpdateCategoryDto;
        if (!payload.id) throw Error(Errors.MISSING_ID);

        if (payload.id < 0 ||
            Number.isNaN(payload.id)) throw Error(Errors.INVALID_FIELDS);

        if (!(await existsById(payload.id))) throw Error(Errors.NOT_FOUND);

        if (!payload.name ||
            !payload.description) throw Error(Errors.MISSING_FIELDS)

        payload.name = payload.name.trim();

        const updated = await UpdateCategory(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Category updated',
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

        const statusUpdated = await changeCategoryStatus(id);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Category status updated',
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
