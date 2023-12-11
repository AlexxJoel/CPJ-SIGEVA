export type TransactionHistory = {
    index: number;
    id: number;
    createdAt: string;
    paymentMethod: string;
    totalAmount: number;
    transactionType: string;
    sellerName: string;
    buyerName: string;
    products: Array<product>;
}

export type product = {
    id: number;
    name: string;
    description: string;
    unitPrice: number;
    quantitySold: number;
    category: string;
}