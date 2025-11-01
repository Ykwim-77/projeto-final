import express from 'express';
import  controller  from '../../controllers/user-controller/user-controller.js';
import authMiddleware from '../../midllewares/authController.js';

const roteador_usuario = express.Router();
 

roteador_usuario.get("/", (req, res) =>{
    controller.pegarTodosUsuarios(req, res);
})

roteador_usuario.get("/:id", (req, res) => {
    controller.pegar1Usuario(req, res);
});

roteador_usuario.post("/", (req, res) => {
    controller.criarUsuario(req, res);
});

roteador_usuario.post("/desativar/:id", (req, res) => {
    controller.desativarUsuario(req, res);
});

roteador_usuario.put("/:id", (req, res) => {
    controller.atualizarUsuario(req, res);
});

roteador_usuario.delete("/:id", (req, res) => {
    controller.deletarUsuario(req, res);
});
roteador_usuario.post("/login", authMiddleware, (req, res) => {
    controller.Login(req, res);
})

//midlleware
//vai verificar se o usuário está autorizado a fazer alguma coisa na rota que o midlleware estiver

//controller
//procurar o usuário
//criar o token
//armazenar o token nos cookies do navegador
//




export default roteador_usuario


//tipos de usuarios
//admin 
//user


//rotas de usuarios
//get
    //pegar um usuario
    //pegar todos os usuarios
//post
    //criar um usuario
//delete
//put
    //atualizar um usuario


