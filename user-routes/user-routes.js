import express from 'express';
import  roteador_usuario  from '../controllers/user-controller.js';


roteador = express.Router();

roteador.get("/", (req, res) =>{
    roteador_usuario.pegarTodosUsuarios(res, res);
})

roteador.get("/:id", (req, res) => {
    roteador_usuario.pegar1Usuario(res, res);
});

roteador.post("/", (req, res) => {
    roteador_usuario.criarUsuario(res, res);
});

roteador.post("/desativar/:id", (req, res) => {
    roteador_usuario.desativarUsuario(res, res);
});

roteador.put("/:id", (req, res) => {
    roteador_usuario.atualizarUsuario(res, res);
});

roteador.delete("/:id", (req, res) => {
    roteador_usuario.deletarUsuario(res, res);
});

export default rota_usuario


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


