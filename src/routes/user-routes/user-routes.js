import express from 'express';
import  controller  from '../../controllers/user-controller/user-controller.js';
import authMiddleware from '../../midllewares/authController.js';

const roteador_usuario = express.Router();




// Rotas públicas
roteador_usuario.post("/", (req, res) => {
    controller.criarUsuario(req, res);
});
roteador_usuario.post("/login", (req, res) => {
    controller.Login(req, res);
});

roteador_usuario.get("/logado", authMiddleware, (req, res) => {
    controller.pegarUsuarioLogado(req, res);
});


// Rotas protegidas
roteador_usuario.get("/", authMiddleware, (req, res) =>{
    controller.pegarTodosUsuarios(req, res);
})
roteador_usuario.get("/:id", authMiddleware, (req, res) => {
    controller.pegar1Usuario(req, res);
});
roteador_usuario.post("/desativar/:id", authMiddleware, (req, res) => {
    controller.desativarUsuario(req, res);
});
roteador_usuario.put("/:id", authMiddleware, (req, res) => {
    controller.atualizarUsuario(req, res);
});
roteador_usuario.delete("/:id", authMiddleware, (req, res) => {
    controller.deletarUsuario(req, res);
});



export default roteador_usuario;


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


