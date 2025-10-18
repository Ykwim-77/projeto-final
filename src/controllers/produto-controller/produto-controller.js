import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function pegar1Produto(req, res){
    try {

        const idNumber = parseInt(req.params.id);
        const produto = await prisma.produto.findUnique({
            where: {
                id_produto: idNumber
            }
        });
        return res.status(200).json(produto);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

async function pegarTodosProdutos(req, res){
    try {
        const produtos = await prisma.produto.findMany();
       return res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({error: error.message});
    }   
}

async function criarProduto(req, res){ 

}

async function reservarProduto(req, res){

}

async function entregarProduto(req, res){

}

async function atualizarProduto(req, res){

}
async function deletarProduto(req, res){

}

export default {pegar1Produto, pegarTodosProdutos, criarProduto, reservarProduto, entregarProduto, atualizarProduto, deletarProduto}