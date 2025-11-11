import controller from "../../controllers/produto-controller/produto-controller.js";
import express, { Router } from "express";
import authMiddleware from "../../midllewares/authController.js";

const roteador_produto = express.Router();


roteador_produto.get("/", (req, res) => {
    controller.pegarTodosProdutos(req, res);
});

roteador_produto.get("/:id", (req, res) => {
    controller.pegar1Produto(req, res);
});

roteador_produto.post("/", authMiddleware, (req, res) => {
    controller.criarProduto(req, res);
});

roteador_produto.post("/reservar/:id", authMiddleware, (req, res) => {
    controller.reservarProduto(req, res);
});

roteador_produto.post("/entregar/:id", authMiddleware, (req, res) => {
    controller.entregarProduto(req, res);
});

roteador_produto.put("/:id", authMiddleware, (req, res) => {
    controller.atualizarProduto(req, res);
});

roteador_produto.delete("/:id", authMiddleware, (req, res) => {
    controller.deletarProduto(req, res);
});


export default roteador_produto;


//rotas de produtos
//get
    //pegar um produto
    //pegar todos os produtos
//post
    //criar um produto
    //reservar um produto
    //entregar um produto
//delete
//put
    //atualizar um produto

