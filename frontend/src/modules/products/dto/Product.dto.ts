export type ProductDto = {
    id: number;
    name: string;
    description: string;
    quantity: number;
    price: number;
    status: number;
    category:{
        id:number;
        name:string;
        description:string;
    }
}