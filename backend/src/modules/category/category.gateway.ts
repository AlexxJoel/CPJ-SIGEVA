import { DatabaseError } from "pg";
import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres";
import { SaveCategoryDto, UpdateCategoryDto } from "./category.dtos"
import { mapCategoriesResponse } from "./utils/categoryFunctions";

const existsById = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: existsRows } = await pool.query(`select id from categories where id = $1;`,
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
        const { rows: existsRows } = await pool.query(`select id from categories where name = $1;`,
            [name]);
        return !!existsRows[0]?.id
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}
const findOne = async (id: number) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: categoryRows } = await pool.query(`select * from categories where id = $1;`,
            [id]);
        console.log(categoryRows);
        return mapCategoriesResponse(categoryRows)[0];
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}
const findAll = async () => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: categoryRows } = await pool.query(`select * from categories order by id asc;`);
        return mapCategoriesResponse(categoryRows);
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}
const saveCategory = async (payload: SaveCategoryDto) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: categoryRow } = await client.query(`insert into categories (name, description) 
        VALUES ($1,$2) returning id;`, [
            payload.name,
            payload.description
        ]);
        if (!categoryRow[0].id) throw Error(Errors.ERROR_SAVING);
        await client.query('COMMIT');
        return !!categoryRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release();
    }

}
const UpdateCategory = async (payload: UpdateCategoryDto) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: categoryRow } = await client.query(`update categories set name = $1, description = $2 
            where id = $3 returning id;`, [
            payload.name,
            payload.description,
            payload.id
        ]);
        if (!categoryRow[0].id) throw Error(Errors.ERROR_UPDATING);
        await client.query('COMMIT');
        return !!categoryRow[0].id;
    } catch (error) {
        console.log(error);
        await client.query('ROLLBACK');
        if (error instanceof DatabaseError) throw Error(Errors.SERVER_ERROR);
        throw error;
    } finally {
        client.release();
    }
}
const changeCategoryStatus = async (id: number) => {
    const pool = PoolSingleton.getInstance();
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const { rows: categoryRow } = await client.query(`update categories set status = not status where id = $1 returning id;`,
            [id]);
        if (!categoryRow[0].id) throw Error(Errors.ERROR_DELETING);
        await client.query('COMMIT');
        return !!categoryRow[0].id;
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
    findOne,
    findAll,
    saveCategory,
    UpdateCategory,
    changeCategoryStatus,
}