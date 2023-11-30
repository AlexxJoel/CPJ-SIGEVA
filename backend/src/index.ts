import app from "./config/express";
import {PoolSingleton} from "./config/postgres";

const main = async () => {
    try {
        let pool = await PoolSingleton.getInstance();
        let pool2 = await PoolSingleton.getInstance();
        console.log(pool === pool2? 'Singleton works' : 'Singleton failed');
        const response = await pool.query('select * from users');
        console.log(response.rows);

        app.listen(app.get('port'), () => console.log(`📑 Server starting on port ${app.get('port')}`));
    } catch (e) {
        console.log(e)
    }
}

main().then(_ => console.log('Server started')).catch(e => console.log(e));