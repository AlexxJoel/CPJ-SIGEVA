import { DatabaseError } from "pg";
import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres"
import { SaveProductDto, UpdateProductDto } from "./product.dtos"
import { mapProductsResponse } from "./utils/productFunctions";

const existsById = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: existsRows } = await pool.query(`select id from products where id = $1;`,
            [id]);
        return !!existsRows[0]?.id;
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}
const existsByName = async (name: String) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: existsRows } = await pool.query(`select id from products where name = $1;`,
            [name]);
        return !!existsRows[0]?.id
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}
const getProductoExistance = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: productRow } = await pool.query(`select quantity from product where id = $1;`,
            [id]);
        return productRow[0].quantity;
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}
const findOne = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: productRows } = await pool.query(`select p.*, c.name as category_name, c.description as category_description from products p inner join categories c on c.id = p.categories_id where p.id = $1;`,
            [id]);
        return mapProductsResponse(productRows)[0];
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}
const findAll = async (name: String) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: productRows } = await pool.query(`select p.*, c.name as category_name, c.description as category_description from products p 
            inner join categories c on c.id = p.categories_id 
            where p.name ILIKE $1 order by p.id asc;`,
            [`%${name || ''}%`]);
        return mapProductsResponse(productRows);
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}
const saveProduct = async (payload: SaveProductDto) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: productRow } = await client.query(`INSERT INTO products (name, description, quantity, unit_price, categories_id) 
        VALUES ($1,$2,$3,$4,$5) returning id;`, [
            payload.name,
            payload.description,
            payload.quantity,
            payload.unitPrice,
            payload.categoriesId
        ]);
        if (!productRow[0].id) throw Error(Errors.ERROR_SAVING);
        await client.query('COMMIT');
        return !!productRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release();
    }
}
const updateProduct = async (payload: UpdateProductDto) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: productRow } = await client.query(`update products set name = $1, description = $2, 
            quantity = $3, unit_price = $4, categories_id = $5 where id = $6 returning id;`, [
            payload.name,
            payload.description,
            payload.quantity,
            payload.unitPrice,
            payload.categoriesId,
            payload.id
        ]);
        if (!productRow[0].id) throw Error(Errors.ERROR_UPDATING);
        await client.query('COMMIT');
        return !!productRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release();
    }
}
const changeProductStatus = async (id: number) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: productRow } = await client.query(`update products set status = not status where id = $1 returning id;`,
            [id]);
        if (!productRow[0].id) throw Error(Errors.ERROR_DELETING);
        await client.query('COMMIT');
        return !!productRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release();
    }
}

export {
    existsById,
    existsByName,
    getProductoExistance,
    findOne,
    findAll,
    saveProduct,
    updateProduct,
    changeProductStatus,
}