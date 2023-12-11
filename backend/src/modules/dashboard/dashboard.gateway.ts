import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres";
import { Dashboard } from "./dashboard.dtos";

const findAll = async (payload: Dashboard) => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: amountRow } = await pool.query(`SELECT
            SUM(total_amount) AS total_amount
            FROM
                transactions
            WHERE
                creation_date >= CURRENT_DATE - INTERVAL '${payload.interval} ${payload.intervalType}';`);
        return amountRow[0].total_amount
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

export {
    findAll
}