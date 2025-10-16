import controller from "../produto-controller/produto-controller.js";
import express, { Router } from "express";

roteador = Router();


roteador.get("/", (req, res) => {
    controller.pegarTodosProdutos(res, res);
});

roteador.get("/:id", (req, res) => {
    controller.pegar1Produto(res, res);
});

roteador.post("/", (req, res) => {
    controller.criarProduto(res, res);
});

roteador.post("/reservar/:id", (req, res) => {
    controller.reservarProduto(res, res);
});

roteador.post("/entregar/:id", (req, res) => {
    controller.entregarProduto(res, res);
});

roteador.put("/:id", (req, res) => {
    controller.atualizarProduto(res, res);
});

roteador.delete("/:id", (req, res) => {
    controller.deletarProduto(res, res);
});

export default rota_produto;


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

