import { ClientBoundary } from "../client/client.boundary";
import { ProductBoundary } from "../product/product.boundary";
import { StaffBoundary } from "../staff/staff.boundary";
import { SupplierBoundary } from "../supplier/supplier.boundary";

export type Transaction = {
    id?: number;
    creationDate?: string;
    paymentDate?: string;
    totalAmount: number;
    transactionTypesId: number;
    peopleId: number;
    staffId: number;
    transactionType: {
        id?: number;
        name: string;
        description?: string;
    };
    clientInfo?: ClientBoundary;
    staffInfo?: StaffBoundary;
    supplierInfo: SupplierBoundary,
    charge: [ProductBoundary & {
        quantitySold: number;
    }],
    sendEmail: boolean;
}

export type TicketDto = {
    costumerName: string;
    charge: [ProductBoundary & {
        quantitySold: number;
    }]
}