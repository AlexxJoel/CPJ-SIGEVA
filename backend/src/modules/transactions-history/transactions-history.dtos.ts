export type TransactionHistoryDto = {
    id?: number,
    creationDate: string,
    paymentDate?: string,
    totalAmount: number,
    transactionType: string,
    sellerName: string,
    buyerName: string,
    products: [{
        id?: number,
        name: string,
        description?: string,
        unitPrice: number,
        quantitySold: number,
        category: string,
    }]
}