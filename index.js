import express from 'express';
import cors from 'cors';
import roteador_usuario from './src/routes/user-routes/user-routes.js';
import roteador_produto from './src/routes/poduto-routes/produto-routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(roteador_usuario);
app.use(roteador_produto);

app.listen(3000);