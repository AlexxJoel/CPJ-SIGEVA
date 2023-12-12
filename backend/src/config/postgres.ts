import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config();

const PORT: string = process.env.PORTDB || '5432'
const SSL: boolean = Boolean( process.env.SSL === 'true') || false

//create a new pool with design pattern singleton
export class PoolSingleton extends Pool{
    private static _instance: PoolSingleton;

    private constructor(config: any) {
        super(config);
    }
    public static getInstance(): PoolSingleton {
        return this._instance || (this._instance = new Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: parseInt(PORT),
            ssl: SSL,
            idleTimeoutMillis: 30000,
        }))
    }
}