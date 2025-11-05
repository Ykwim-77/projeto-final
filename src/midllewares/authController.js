import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import express from 'express';



const app = express();
app.use(cookieParser());

const authMiddleware = (req, res, next) => {
  try {

    const token = req.cookies.token;
    
    console.log(token);
    console.log('🔐 Verificando token...');

    
    if (!token) {
      console.log('❌ Token não encontrado');
      return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    console.log(decoded);


    // Adicionar os dados do usuário no request
    req.usuario = decoded;
    
    console.log('✅ Token válido para usuário:', decoded.email, decoded);
    next(); // Prosseguir para a próxima função/rota
    
  } catch (error) {
    console.error('❌ Erro na verificação do token:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido.' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado.' });
    }
    
    return res.status(500).json({ error: 'Erro na autenticação.' });
  }
};

export default authMiddleware;