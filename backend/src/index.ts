import app from "./config/express";

const main = async () => {
    try {
        app.listen(app.get('port'), () => console.log(`📑 Server starting on port ${app.get('port')}`));
    } catch (e) {
        console.log(e)
    }
}

main().then(_ => console.log('Server started')).catch(e => console.log(e));