import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken";
import cors from "cors";
import express from "express";
import bcrypt from "bcrypt";
import crypto from 'crypto';
import {PegarApenasUm, Deletar} from "../../function.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // URL exata do seu Angular
  credentials: true, // PERMITE credenciais (cookies, headers de autenticação)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

const prisma = new PrismaClient()

async function teste(req, res) {
    
}

async function Login(req, res) {
    const { email, senha } = req.body; 
    const emailNormalizado = (email || '').trim().toLowerCase();
    console.log('Login attempt for email:', emailNormalizado);
    // Validação básica
    if (!emailNormalizado || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha são obrigatórios' });
    }
    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: emailNormalizado
            }
        });
        if (usuario) {
            console.log('Usuario encontrado:', { id: usuario.id_usuario, email: usuario.email, hashLength: usuario.senha?.length });
        } else {
            console.log('Usuario nao encontrado para email:', emailNormalizado);
        }
        if (!usuario) {
            return res.status(401).json({ mensagem: 'Credenciais inválidas' });
        }


        // Gera o token
        const token = jwt.sign(
            { 
                id: usuario.id_usuario,
                email: usuario.email,
                nome: usuario.nome
            }, 
            process.env.JWT_SECRET || 'segredo',
            { expiresIn: '1h' }
        );
        console.log(token)
        // Define o cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "lax",
            maxAge: 3600000
        });
        return res.status(200).json({
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email,
                tipo_usuario: usuario.tipo_usuario, // Campo correto do schema
                ativo: usuario.ativo,
                cpf: usuario.cpf
            },
            token: token
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ mensagem: 'Erro interno do servidor' });
    }
}

async function pegar1Usuario(req, res){
    try{
        const usuario = await PegarApenasUm('usuario', 'id_usuario', req.params.id)
        return res.status(200).json(usuario)

    }catch(error){
        return res.status(500).json({moio:"deu ruim na pegar 1 usuario", error})
    }

}

async function pegarTodosUsuarios(req, res){ // acabar o pegartodos os usuarios
    try{
        const usuarios = await prisma.usuario.findMany()
        return res.status(200).json(usuarios)
    }catch(error){
        return res.status(500).json({pegartodosusuario:"deu pau pra pegar todos os usuarios ", error})
    }

}



async function criarUsuario(req, res) {
    try {
        const { nome, email, senha_hash, senha, tipo_usuario, ativo, cpf, departamento } = req.body;
        // Aceita tanto 'senha' quanto 'senha_hash' vindo do frontend
        const senhaClara = senha || senha_hash; // Prioriza campo 'senha' se vier
        if (!senhaClara) {
            return res.status(400).json({ mensagem: 'Senha é obrigatória.' });
        }

        // Mapeia tipo_usuario (string) para id_tipo_usuario (number)
        const tipoMap = {
            'A': 1, // Administrador
            'G': 2, // Gerente
            'O': 3, // Operador
            'C': 4  // Cliente
        };
        const id_tipo_usuario = tipoMap[tipo_usuario] || 3; // Padrão: Operador

        const hash = await bcrypt.hash(senhaClara, 10);
        await prisma.usuario.create({
            data: {
                nome: nome,
                email: email,
                senha: hash,
                tipo_usuario: tipo_usuario,
                cpf: cpf
            }
        });
        return res.status(201).json({ mensagem: 'usuario foi criado com sucesso' });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        return res.status(500).json({ criar_usuario: 'Erro ao criar usuário', error: error.message });
    }
}
async function atualizarUsuario(req, res){
    try{
        const {nome, email, senha, senha_hash, tipo_usuario, ativo, cpf} = req.body

        // Aceita tanto 'senha' quanto 'senha_hash' vindo do frontend
        const senhaClara = senha || senha_hash;

        // Mapeia tipo_usuario (string) para o formato do banco
        const tipoMap = {
            'A': 'A', // Administrador
            'G': 'G', // Gerente
            'O': 'O', // Operador
            'C': 'C',  // Cliente
            'admin': 'A',
            'gerente': 'G',
            'operador': 'O',
            'cliente': 'C'
        };
        const tipoBanco = tipoMap[tipo_usuario] || tipo_usuario;

        const updateData = {
            nome: nome,
            email: email,
            tipo_usuario: tipoBanco,
            ativo: ativo !== undefined ? ativo : true,
            cpf: cpf
        };

        // Só atualiza senha se foi fornecida
        if (senhaClara && senhaClara.trim() !== '') {
            updateData.senha = await bcrypt.hash(senhaClara, 10);
        }

        await prisma.usuario.update({
            where:{
                id_usuario: parseInt(req.params.id)
            },
            data: updateData
        })
        return res.status(200).json({mensagem:"usuario foi atualizado com sucesso"})
    }catch(error){
        console.error('Erro ao atualizar usuário:', error);
        return res.status(500).json({atualizar_usuario:"Erro ao atualizar usuário", error: error.message})
    }

}
async function deletarUsuario(req, res){
    try{
        await Deletar('usuario', 'id_usuario', req.params.id)
        return res.status(200).json({mensagem:"usuario foi deletado com sucesso"})
    }catch(error){
        return res.status(500).json({deletar_usuario:"ve oq q aconteceu para deletar o usuario ai paizão", error})
    }
}
async function desativarUsuario(req, res){
    try{
        await prisma.usuario.update({
            where:{
                id_usuario: req.params.id
            },
            data:{
                ativo: false
            }
        })
        return res.status(200).json({mensagem:"usuario foi desativado com sucesso"})
    }catch(error){
        return res.status(500).json({desativar_usuario:"ve oq q aconteceu para desativar o usuario ai paizão", error})
    }
}
async function pegarUsuarioLogado(req, res){
    console.log("pegando usuario logado");
    try {
        // authMiddleware decodifica o token para `req.usuario`
        const decoded = req.usuario;
        if (!decoded || !decoded.email) {
            // fallback para body.email se token não estiver presente
            const email_body = req.body?.email;
            if (!email_body) return res.status(400).json({ mensagem: 'Email não fornecido' });
            const usuario = await prisma.usuario.findUnique({ where: { email: email_body } });
            return res.status(200).json(usuario);
        }
        const usuario = await prisma.usuario.findUnique({ where: { email: decoded.email } });
        return res.status(200).json(usuario);
    } catch (error) {
        console.error('Erro ao buscar usuário logado:', error);
        return res.status(500).json({ mensagem: 'Erro interno ao buscar usuário logado' });
    }
}

async function Logout(req, res){
    try{
        // Limpa o cookie de autenticação httpOnly
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
        return res.status(200).json({ mensagem: 'Logout realizado' });
    }catch(error){
        console.error('Erro no logout:', error);
        return res.status(500).json({ mensagem: 'Erro ao realizar logout' });
    }
}

export default {pegar1Usuario, pegarTodosUsuarios, criarUsuario, atualizarUsuario, deletarUsuario, Login, pegarUsuarioLogado, Logout} 