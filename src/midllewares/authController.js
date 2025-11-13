import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import express from 'express';



const app = express();
app.use(cookieParser());

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
    req.usuario = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ mensagem: 'Token inválido.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensagem: 'Token expirado.' });
    }
    return res.status(500).json({ mensagem: 'Erro na autenticação.' });
  }
};

export default authMiddleware;