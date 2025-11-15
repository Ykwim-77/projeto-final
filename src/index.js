
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import roteador_usuario from './routes/user-routes/user-routes.js';
import roteador_produto from './routes/poduto-routes/produto-routes.js';
import roteador_sala from './routes/sala-routes/sala-routes.js';
import roteador_movi from './routes/movi-routes/movi-routes.js';
import roteador_emprestimo from './routes/emprestimo-routes/emprestimo-routes.js';
import roteador_previsao from './routes/previsao-routes/previsao-routes.js';

const app = express();

// Configurar CORS
const corsOptions = {
  origin: ['http://localhost:4200', 'http://localhost:4201'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Montar rotas
app.use('/usuario', roteador_usuario);
app.use('/produto', roteador_produto);
app.use('/sala', roteador_sala);
app.use('/movimentacao', roteador_movi);
app.use('/emprestimo', roteador_emprestimo);
app.use('/previsao', roteador_previsao);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});
