import express from 'express';
import cors from 'cors';
import roteador_usuario from './routes/user-routes/user-routes.js';
import roteador_produto from './routes/poduto-routes/produto-routes.js';
import roteador_sala from './routes/sala-routes/sala-routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/usuario', roteador_usuario);
app.use('/produto',roteador_produto);
app.use('/sala', roteador_sala);

app.listen(3000);


