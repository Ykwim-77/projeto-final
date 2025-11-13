
import express from 'express';
import cors from 'cors';
import roteador_usuario from './routes/user-routes/user-routes.js';
import roteador_produto from './routes/poduto-routes/produto-routes.js';
import roteador_sala from './routes/sala-routes/sala-routes.js';
import cookieParser from 'cookie-parser';
import roteador_movi from './routes/movi-routes/movi-routes.js'


const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));


app.use(cookieParser());
app.use(express.json());
app.use('/usuario', roteador_usuario);
app.use('/produto',roteador_produto);
app.use('/sala', roteador_sala);
app.use('/movimentacao', roteador_movi)


const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));


app.use(express.json());


app.options('', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

const PORT = 3000;
app.listen(3000)