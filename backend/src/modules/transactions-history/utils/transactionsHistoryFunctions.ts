import { TransactionHistoryDto } from "../transactions-history.dtos"

export const mapTransactionsResponse = (rows: any): TransactionHistoryDto[] => {
    return rows.map((row: any) => ({
        id: row['id_t'],
        creationDate: row['creation_date_t'],
        paymentDate: row['payment_date_t'],
        totalAmount: row['total_amount_t'],
        transactionType: row['transaction_type'],
        sellerName: row['seller_name'],
        buyerName: row['buyer_name'],
        products: row['products']
    }))
}