import express from 'express';
import cors from 'cors';
import roteador_usuario from './src/routes/user-routes/user-routes.js';
import roteador_produto from './src/routes/poduto-routes/produto-routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/usuario', roteador_usuario);
app.use('/produto',roteador_produto);

app.listen(3000);

//teste