import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres";
import { Dashboard } from "./dashboard.dtos";

const findAll = async (payload: Dashboard) => {
    try {
        const pool = PoolSingleton.getInstance();
        const dashboardQuery = `SELECT
            SUM(total_amount) AS total_amount
            FROM
                transactions
            WHERE
                creation_date >= CURRENT_DATE - INTERVAL '${payload.interval} ${payload.intervalType}'`;
        const { rows: amountIncomeRow } = await pool.query(`${dashboardQuery} AND transaction_types_id != 3;`);
        const { rows: amountExpensesRow } = await pool.query(`${dashboardQuery} AND transaction_types_id = 3;`);
        return {
            amountIncome: amountIncomeRow[0].total_amount,
            amountExpenses: amountExpensesRow[0].total_amount
        }
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

export {
    findAll
}