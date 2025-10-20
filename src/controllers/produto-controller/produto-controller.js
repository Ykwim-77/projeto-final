import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

async function pegar1Produto(req, res){
    const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });
    } 

    try {
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
    const {nome, descricao, categoria, codigo_publico, preco_unitario, unidade_medida, } = req.body;

    try {
        const produto = await prisma.produto.create({
            data:{
                nome:nome,
                descricao:descricao,
                categoria:categoria,
                codigo_publico:codigo_publico,
                preco_unitario: preco_unitario,
                unidade_medida:unidade_medida
            }
        })
         return res.status(201).json({mensagem:`o produto ${nome} foi criado com sucesso`});
    } catch(error){
        return res.status(500).json("fodeu com tudo pia, cancela o gole", error)
    }
}

async function reservarProduto(req, res){
    const id = req.params.id
    const idnumber = parseInt(id);
    if (isNaN(idnumber)) {
        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });
    }
    try{
        const produto = await prisma.produto.findUnique({
            where:{
                id_produto:idnumber
            }
        })

        if(produto.status == false){
            return res.status(400).json({indisponivel:"produto ja está reservado"})
        }
        await prisma.produto.update({
            where:{
                id_produto: idnumber
            },
            data:{
                status: false,
            }
        });
    } catch(error){
        res.status(500).json({erro:"deu pau na reserva, da um jeito ai patrão: ", error})
    }

    const produto = prisma.produto.findUnique({
        where:{
            id_produto: idnumber
        }
    })

    return res.status(201).json({reservado:`O produto ${produto.nome} foi reservado!!`})
}

async function entregarProduto(req, res){
    const id = req.params.id;
    const idnumber = parseInt(id);

    if(isNaN(idnumber)){
        return res.status(400).json({nao_numero:"faz favor de passar o id certo ai"});
    }
    try{
        const produto = await prisma.produto.findUnique({
            where:{
                id_produto: idnumber
            }
        })
        if(produto.status == true){
            return res.status(400).json({ja_entregue:"o produto ja foi entregue ;)"})
        }


        await prisma.produto.update({
            where:{
                id_produto:idnumber
            },
            data:{
                status: true
            }
        });
        return res.status(201).json({mensagem:"Produto foi entregue com sucesso!!"});
    }catch(error){
        return res.status(500).json({erro_entrega_produto:"ve oq q ta acontecendo com a entrega de produto", error})
    };

}

async function atualizarProduto(req, res){
     //transforma o id em inteiro, também pode ser feito direto, sem usar duas variaveis
    const idNumber = parseInt(req.params.id)
    if(isNaN(idNumber)){ // verifica se o id é do tipo number
        return res.status(400).json({mensagem:"passa um ID Number por favor"})
    }
    try{ // em casos de possiveis erros, sempre é bom usar um try com o cath
        const { nome, descricao, categoria, codigo_publico, preco_unitario, unidade_medida, id_fornecedor} = req.body


        //****>>>caso queira colocar uma verificação se está tudo de acordo<<<****


        // if(!nome || !descricao || !categoria || !codigo_publico || !preco_unitario || !unidade_medida || !id_fornecedor){
        //     return res.status(400).json({Falta_infos:"passa todas as informações, incopetente"});
        // }

        await prisma.produto.update({
            where:{
                id_produto:idNumber
            },
            data:{
                nome:nome,
                descricao:descricao,
                categoria:categoria,
                codigo_publico:codigo_publico,
                preco_unitario:preco_unitario,
                unidade_medida:unidade_medida,
                id_fornecedor:id_fornecedor
            }
        })

    } catch(error){
        return res.status(500).json({vixx:"deu pau na rota atualizar produto, da uma olhada ai!"})
    }
    const produto = prisma.produto.findUnique({
        where:{
            id_produto: idNumber
        }
    })

    return res.status(200).json({mensagem:`O produto ${produto.nome} foi atualizado`})
}
async function deletarProduto(req, res){

}

export default {pegar1Produto, pegarTodosProdutos, criarProduto, reservarProduto, entregarProduto, atualizarProduto, deletarProduto}