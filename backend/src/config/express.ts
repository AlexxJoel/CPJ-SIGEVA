import express, {Application} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Router from "../modules/router";

dotenv.config();

const PORT = process.env.PORT || 3000;
const API = process.env.API || 'sigeva';

const app: Application = express();
app.set('port', PORT);

app.use(cors({
    credentials: true,
    origin: '*'
}))

app.use(express.json({limit: '60mb'}));
app.use(express.urlencoded({extended: false}))

app.get('/test', (req, res) => res.send('Welcome to SIGEVA (Sistema de Gestión de Almacenamiento)'))
app.use(`/${API}/auth`, Router.AuthRoutes);
app.use(`/${API}/`, Router.ProductRoutes);

app.get('*', (req, res) => res.status(404).send('Page Not Found'))
export default app;