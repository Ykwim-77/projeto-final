import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken";

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


async function Login(req, res){
    const {email, senha_hash} = req.body

    try{
        const usuario = await prisma.usuario.findUnique({
            where: {
                email: email,
                senha_hash: senha_hash
            }
        });

        if (usuario) {
            const token = jwt.sign({ id: usuario.id_usuario }, 'segredo');
            return res.status(200).json({ token });
        }
        res.cookie("token", token, {
        httpOnly: true, // impede acesso via JS (protege contra XSS)
        secure: true,   // só envia em HTTPS
        sameSite: "strict", // previne CSRF
        maxAge: 3600000    // 1 hora
    });
    }catch(error){
        
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