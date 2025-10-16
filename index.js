import express from 'express';
import cors from 'cors';
import rota_usuario from './user-routes/user-routes.js';
import rota_produto from './produto-routes/produto-routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(rota_usuario);

app.listen(3000);