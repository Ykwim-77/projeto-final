import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken";
import cors from "cors";
import express from "express";
import bcrypt from "bcrypt";

const app = express();

app.use(cors({
  origin: 'http://localhost:4200', // URL exata do seu Angular
  credentials: true, // PERMITE credenciais (cookies, headers de autenticação)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

const prisma = new PrismaClient()


//rotas de usuarios
//get
    //pegar um usuario
    //pegar todos os usuarios
//post
    //criar um usuario
    //desativar um usuario
//delete
//put
    //atualizar um usuario


async function Login(req, res) {
    console.log(req.body);
    const { email, senha } = req.body; // ✅ Frontend envia "senha"
    console.log(email, senha);
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
        console.log('usuario', usuario);
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

        console.log(token);

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
    const idNumber = parseInt(req.params.id)
    if (isNaN(idNumber)) {
        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });
    } 

    try{
        const usuario = await prisma.usuario.findUnique({
            where:{
                id_usuario: idNumber
            }
        });
        return res.status(200).json(usuario)

    }catch(error){
        return res.status(500).json({moio:"deu ruim na pegar 1 usuario", error})
    }

}

async function pegarTodosUsuarios(req, res){ // acabar o pegartodos os usuarios
    try{

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

}
async function deletarUsuario(req, res){

}
async function desativarUsuario(req, res){
    
}


export default {pegar1Usuario, pegarTodosUsuarios, criarUsuario, atualizarUsuario, deletarUsuario, Login} 