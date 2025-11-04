import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken";
import cors from "cors";
import express from "express";
import bcrypt from "bcrypt";
import {PegarApenasUm, Deletar} from "../../function.js";

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // URL exata do seu Angular
  credentials: true, // PERMITE credenciais (cookies, headers de autenticação)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

const prisma = new PrismaClient()



async function Login(req, res) {
    console.log(req.body);
    const { email, senha } = req.body; 
    // Validação básica
    if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email,
                // Se você quer comparar senha em texto com hash, use bcrypt
                // O código atual compara texto com hash, o que não funciona
            }
        });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // ✅ ADICIONE: Verificação de senha com bcrypt
        // const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
        // if (!senhaValida) {
        //     return res.status(401).json({ error: 'Credenciais inválidas' });
        // }

        // console.log(senhaValida);

        // Gera o token
        const token = jwt.sign(
            { 
                senha: usuario.senha_hash,
                email: usuario.email
            }, 
            process.env.JWT_SECRET || 'segredo',
            { expiresIn: '1h' }
        );


        // Define o cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "strict",
            maxAge: 3600000
        });

        return res.status(200).json({ 
            message: 'Login realizado com sucesso',
            usuario: {
                id: usuario.id_usuario,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({ error: 'Erro interno do servidor' });
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



async function criarUsuario(req, res){ //acabar ao criar
    try{
        const {nome, email, senha_hash, id_tipo_usuario, ativo, cpf} = req.body

        await prisma.usuario.create({
            data:{
                nome: nome,
                email:email,
                senha_hash: senha_hash,
                id_tipo_usuario: id_tipo_usuario,
                ativo: ativo,
                cpf: cpf
            }
        });

        return res.status(201).json({mensagem:"usuario foi criado com sucesso"});
    }catch(error){
        return res.status(500).json({criar_usuario:"ve oq q aconteceu para criar o usuario ai paizão"});
    }



}
async function atualizarUsuario(req, res){
    try{
        const {nome, email, senha_hash, id_tipo_usuario, ativo, cpf} = req.body

        await prisma.usuario.update({
            where:{
                id_usuario: req.params.id
            },
            data:{
                nome: nome,
                email: email,
                senha_hash: senha_hash,
                id_tipo_usuario: id_tipo_usuario,
                ativo: ativo,
                cpf: cpf
            }
        })
        return res.status(200).json({mensagem:"usuario foi atualizado com sucesso"})
    }catch(error){
        return res.status(500).json({atualizar_usuario:"ve oq q aconteceu para atualizar o usuario ai paizão", error})
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
    
}


export default {pegar1Usuario, pegarTodosUsuarios, criarUsuario, atualizarUsuario, deletarUsuario, Login} 