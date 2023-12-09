import { Request, Response } from "express";
import { changeProductStatus, existsById, existsByName, findAll, findOne, saveProduct, updateProduct } from "./product.gateway"
import { Errors, ResponseApi, validateError } from "../../config/error_codes";
import { GetProductDto, SaveProductDto, UpdateProductDto } from "./product.dtos";
import { validateUnitPrice } from "./utils/productFunctions";

const getOne = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!id) throw Error(Errors.MISSING_ID);
        if (Number.isNaN(id)) throw Error(Errors.INVALID_FIELDS);
        if (id <= 0) throw Error(Errors.INVALID_FIELDS);
        if (!(await existsById(id))) throw Error(Errors.NOT_FOUND);

        const product = await findOne(id);

        const body: ResponseApi<GetProductDto> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: product,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const getAll = async (req: Request, res: Response) => {
    try {
        const name = req.body.name;

        const products = await findAll(name);
        const body: ResponseApi<GetProductDto[]> = {
            code: 200,
            error: false,
            message: 'Ok',
            data: products,
        }
        return res.status(body.code).json(body);
    } catch (error) {
        const errorBody = validateError(error as Error);
        return res.status(errorBody.code).json(errorBody);
    }
}

const save = async (req: Request, res: Response) => {
    try {
        const payload = req.body as SaveProductDto;

        if (!payload.name ||
            !payload.quantity ||
            !payload.unitPrice ||
            !payload.categoriesId) throw Error(Errors.MISSING_FIELDS)

        payload.name = payload.name.trim();
        if (payload.name.length < 7 || payload.name.length > 26) throw Error(Errors.INVALID_FIELDS);

        if (await existsByName(payload.name)) throw Error(Errors.ALREADY_EXISTS);

        if (payload.quantity < 0 ||
            Number.isNaN(payload.quantity) ||
            !Number.isInteger(payload.quantity) ||
            payload.unitPrice < 0 ||
            Number.isNaN(payload.unitPrice) ||
            !validateUnitPrice(payload.unitPrice) ||
            payload.categoriesId < 0 ||
            Number.isNaN(payload.categoriesId)) throw Error(Errors.INVALID_FIELDS);

        const saved = await saveProduct(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Product saved',
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
        const payload = req.body as UpdateProductDto;
        if (!payload.id) throw Error(Errors.MISSING_ID);

        if (payload.id < 0 ||
            Number.isNaN(payload.id)) throw Error(Errors.INVALID_FIELDS);

        if (!(await existsById(payload.id))) throw Error(Errors.NOT_FOUND);

        if (!payload.name ||
            !payload.quantity ||
            !payload.unitPrice ||
            !payload.categoriesId) throw Error(Errors.MISSING_FIELDS)

        payload.name = payload.name.trim();
        if (payload.name.length < 7 || payload.name.length > 26) throw Error(Errors.INVALID_FIELDS);
        
        if (payload.quantity < 0 ||
            Number.isNaN(payload.quantity) ||
            !Number.isInteger(payload.quantity) ||
            payload.unitPrice < 0 ||
            Number.isNaN(payload.unitPrice) ||
            !validateUnitPrice(payload.unitPrice) ||
            payload.categoriesId < 0 ||
            Number.isNaN(payload.categoriesId)) throw Error(Errors.INVALID_FIELDS);

        const updated = await updateProduct(payload);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Product updated',
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

        const statusUpdated = await changeProductStatus(id);
        const body: ResponseApi<boolean> = {
            code: 200,
            error: false,
            message: 'Product status updated',
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