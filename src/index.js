
import express from 'express';
import cors from 'cors';
import roteador_usuario from './routes/user-routes/user-routes.js';
import roteador_produto from './routes/poduto-routes/produto-routes.js';
import roteador_sala from './routes/sala-routes/sala-routes.js';
import cookieParser from 'cookie-parser';


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

// Define allowed origins (your frontend URL)
const corsOptions = {
  origin: 'http://localhost:4200',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

// Middleware CORS
app.use(cors(corsOptions));

// Middleware para parsing JSON
app.use(express.json());

// Rota OPTIONS corrigida para preflight
app.options('', (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('🚀🚀🚀 SERVIDOR INICIADO COM SUCESSO 🚀🚀🚀');
  console.log(`📍 Porta: ${PORT}`);
  console.log('📡 URLs para teste:');
  console.log('   http://localhost:3000/test');
  console.log('   http://localhost:3000/usuario/login');
  console.log('='.repeat(60));
});