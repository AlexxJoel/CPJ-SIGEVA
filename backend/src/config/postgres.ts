import { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config();

const PORT: string = process.env.PORTDB || '5432'
const SSL: boolean = Boolean( process.env.SSL === 'true') || false

//create a new pool with design pattern singleton
export class PoolSingleton {
    private static _instance: PoolSingleton;
    private pool: Pool;

    private constructor() {
        this.pool = new Pool({
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            database: process.env.POSTGRES_DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: parseInt(PORT),
            ssl: SSL,
            idleTimeoutMillis: 40000,
        })
    }
    public static getInstance(): PoolSingleton {
        if (!PoolSingleton._instance) {
            PoolSingleton._instance = new PoolSingleton();
        }
        return PoolSingleton._instance;
    }

    public async query(text: string, params: any[]): Promise<any> {
        const start = Date.now();
        const res = await this.pool.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res.rowCount });
        return res;
    }
}