import { PrismaClient } from "@prisma/client"

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



async function pegar1Usuario(req, res){
    const idNumber = (req.params.id)
    try{
        const usuario = prisma.usuario.findUnique({
            where:{
                id_usuario: idNumber
            }
        });
        return res.status(200).json({Usuario_encontrado:`o usuário ${usuario.nome} foi encontrado`}).json(usuario)

    }catch(error){
        return res.status(500).json({moio:"deu ruim na pegar 1 usuario"})
    }

}

async function pegarTodosUsuarios(req, res){

}

async function criarUsuario(req, res){

}
async function atualizarUsuario(req, res){

}
async function deletarUsuario(req, res){

}
async function desativarUsuario(req, res){
    
}


export default {pegar1Usuario, pegarTodosUsuarios, criarUsuario, atualizarUsuario, deletarUsuario} 