import { Errors } from "../../config/error_codes";
import { PoolSingleton } from "../../config/postgres"
import { mapTransactionsResponse } from "./utils/transactionsHistoryFunctions";

const findAll = async () => {
    try {
        const pool = PoolSingleton.getInstance();
        const { rows: transactionsRows } = await pool.query(`
        SELECT
            t.id as id_t,
            t.creation_date as creation_date_t,
            t.payment_date as payment_date_t,
            t.total_amount as total_amount_t,
            tt.name AS transaction_type,
            json_agg(json_build_object(
                'id', p.id,
                'name', p.name,
                'description', p.description,
                'unitPrice', p.unit_price,
                'quantitySold', thp.quantity,
                'category', c.name)) AS products,
            p2.name || ' ' || p2.surname || ' ' || COALESCE(p2.lastname, '') AS seller_name,
            p3.name || ' ' || p3.surname || ' ' || COALESCE(p2.lastname, '') AS buyer_name
        FROM
            transactions_has_products thp
            INNER JOIN transactions t ON t.id = thp.transactions_id
            INNER JOIN transaction_types tt ON tt.id = t.transaction_types_id
            INNER JOIN products p ON p.id = thp.products_id
            INNER JOIN categories c ON p.categories_id = c.id
            INNER JOIN staff s ON s.id = t.staff_id
            INNER JOIN people p2 ON p2.id = s.people_id
            INNER JOIN people p3 ON p3.id = t.people_id
        GROUP BY
            t.id,
            t.creation_date,
            t.payment_date,
            t.total_amount,
            tt.name,
            s.id,
            p2.id,
            p3.id
        ORDER BY
            tt.name,
            t.id
        ASC;`);
        return mapTransactionsResponse(transactionsRows);
    } catch (error) {
        console.log(error);
        throw Error(Errors.SERVER_ERROR);
    }
}

export {
    findAll
}