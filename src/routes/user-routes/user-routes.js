import express from 'express';
import  controller  from '../../controllers/user-controller/user-controller.js';


const roteador_usuario = express.Router();


roteador_usuario.get("/", (req, res) =>{
    controller.pegarTodosUsuarios(res, res);
})

roteador_usuario.get("/:id", (req, res) => {
    controller.pegar1Usuario(res, res);
});

roteador_usuario.post("/", (req, res) => {
    controller.criarUsuario(res, res);
});

roteador_usuario.post("/desativar/:id", (req, res) => {
    controller.desativarUsuario(res, res);
});

roteador_usuario.put("/:id", (req, res) => {
    controller.atualizarUsuario(res, res);
});

roteador_usuario.delete("/:id", (req, res) => {
    controller.deletarUsuario(res, res);
});



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


