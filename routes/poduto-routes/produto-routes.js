import controller from "../../controllers/produto-controller/produto-controller.js";
import express, { Router } from "express";

const roteador_produto = express.Router();


roteador_produto.get("/", (req, res) => {
    controller.pegarTodosProdutos(res, res);
});

roteador_produto.get("/:id", (req, res) => {
    controller.pegar1Produto(res, res);
});

roteador_produto.post("/", (req, res) => {
    controller.criarProduto(res, res);
});

roteador_produto.post("/reservar/:id", (req, res) => {
    controller.reservarProduto(res, res);
});

roteador_produto.post("/entregar/:id", (req, res) => {
    controller.entregarProduto(res, res);
});

roteador_produto.put("/:id", (req, res) => {
    controller.atualizarProduto(res, res);
});

roteador_produto.delete("/:id", (req, res) => {
    controller.deletarProduto(res, res);
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

