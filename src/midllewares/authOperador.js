import express from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express();
app.use(cookieParser());

async function authGerente(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ mensagem: 'Acesso negado. Token não fornecido.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'segredo');
        req.usuario = decoded;

        const usuario = await prisma.usuario.findUnique({
            where: {
                id_usuario: decoded.id
            }
        });
        console.log(usuario)
        if (!usuario) {
          return res.status(401).json({ mensagem: 'Usuário não encontrado.' });
        }
        if (usuario.tipo_usuario !== 'O') {
          return res.status(401).json({ mensagem: 'Usuário não é um gerente.' });
        }
        
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

export default authGerente;