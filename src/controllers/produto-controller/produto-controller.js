import { PrismaClient } from "@prisma/client";
import { PegarApenasUm, Deletar } from "../../function.js"


const prisma = new PrismaClient();

async function pegar1Produto(req, res){
    try {
        const ApenasUm = await PegarApenasUm('patrimonio', 'id_patrimonio', req.params.id)
        return res.status(200).json(ApenasUm);
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

async function pegarTodosProdutos(req, res){
    try {
        const produtos = await prisma.patrimonio.findMany();
       return res.status(200).json(produtos);
    } catch (error) {
        res.status(500).json({error: error.message});
    }   
}

async function criarProduto(req, res){ 
    const {nome, descricao, categoria, codigo_publico, preco_unitario, unidade_medida, } = req.body;

    if(!nome || !descricao || !categoria || !codigo_publico || !preco_unitario || !unidade_medida){
        return res.status(400).json({mensagem:"passa todas as informações, incopetente"});
    }

    try {
        const patrimonio = await prisma.patrimonio.create({
            data:{
                nome:nome,
                descricao:descricao,
                categoria:categoria,
                codigo_publico:codigo_publico,
                preco_unitario: preco_unitario,
                unidade_medida:unidade_medida
            }
        })
         return res.status(201).json({mensagem:`o patrimonio ${patrimonio.nome} foi criado com sucesso`});
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
        const patrimonio = await prisma.patrimonio.findUnique({
            where:{
                id_patrimonio:idnumber
            }
        })

        if(patrimonio.status == false){
            return res.status(400).json({indisponivel:"patrimonio ja está reservado"})
        }
        await prisma.patrimonio.update({
            where:{
                id_patrimonio: idnumber
            },
            data:{
                status: false,
            }
        });
    } catch(error){
        res.status(500).json({erro:"deu pau na reserva, da um jeito ai patrão: ", error})
    }

    const patrimonio = await prisma.patrimonio.findUnique({
        where:{
            id_patrimonio: idnumber
        }
    })

    return res.status(201).json({reservado:`O patrimonio ${patrimonio.nome} foi reservado!!`})
}

async function entregarProduto(req, res){
    const id = req.params.id; //vai ser padronizado, o id vai ser transformado em número em apenas uma linha; 
    const idnumber = parseInt(req.params.id);

    if(isNaN(idnumber)){
        return res.status(400).json({nao_numero:"faz favor de passar o id certo ai"});
    }
    try{
        const patrimonio = await prisma.patrimonio.findUnique({
            where:{
                id_patrimonio: idnumber
            }
        })
        if(patrimonio.status == true){
            return res.status(400).json({ja_entregue:"o patrimonio ja foi entregue ;)"})
        }


        await prisma.patrimonio.update({
            where:{
                id_patrimonio:idnumber
            },
            data:{
                status: true
            }
        });
        return res.status(201).json({mensagem:"patrimonio foi entregue com sucesso!!"});
    }catch(error){
        return res.status(500).json({erro_entrega_produto:"ve oq q ta acontecendo com a entrega de patrimonio", error})
    };

}

async function atualizarProduto(req, res){
     //transforma o id em inteiro, também pode ser feito direto, sem usar duas variaveis
    const idNumber = parseInt(req.params.id)
    if(isNaN(idNumber)){ // verifica se o id é do tipo number
        return res.status(400).json({mensagem:"passa um ID Number por favor"})
    }
    try{ // em casos de possiveis erros, sempre é bom usar um try com o cath
        const { nome, descricao, categoria, codigo_publico, preco_unitario, unidade_medida, id_fornecedor, estoque, min_estoque} = req.body


        //****>>>caso queira colocar uma verificação se está tudo de acordo<<<****
        

        // if(!nome || !descricao || !categoria || !codigo_publico || !preco_unitario || !unidade_medida || !id_fornecedor){
        //     return res.status(400).json({Falta_infos:"passa todas as informações, incopetente"});
        // }

        const produtoExistente = await prisma.patrimonio.findUnique({
            where: { id_patrimonio: idNumber }
        });

        if (!produtoExistente) {
            return res.status(404).json({ mensagem: 'patrimonio não encontrado' });
        }

        const produtoAtualizado = await prisma.patrimonio.update({
            where: { id_patrimonio: idNumber },
            data: {
                nome: nome,
                descricao: descricao,
                categoria: categoria,
                codigo_publico: codigo_publico,
                preco_unitario: preco_unitario,
                unidade_medida: unidade_medida,
                id_fornecedor: id_fornecedor,
                estoque: estoque,
                min_estoque: min_estoque
            }
        });

        return res.status(200).json({ mensagem: `O patrimonio ${produtoAtualizado.nome} foi atualizado`, patrimonio: produtoAtualizado });
        

    } catch(error){
        return res.status(500).json({vixx:"deu pau na rota atualizar patrimonio, da uma olhada ai!"})
    }


    
}
async function deletarProduto(req, res){
    const id = req.params.id;
    try{
        const idNumber = parseInt(id);
        if(isNaN(idNumber)){ // verifica se o id é do tipo number
             throw new Error("ID deve ser um número válido");
        }
    
        const deletado = await prisma.patrimonio.findUnique({
            where:{
                id_patrimonio: idNumber
            }
        })
        if(!deletado){
            throw new Error("Registro não encontrado");
        }
        console.log(deletado)
        await prisma.patrimonio.delete({
            where:{
                id_patrimonio: idNumber
            }
        })
        
        return res.status(200).json({ mensagem: `${deletado.nome} foi deletado com sucesso` });
    
    }catch (error) {
        return res.status(500).json({ error: error.message });
    }

}


export default {pegar1Produto, pegarTodosProdutos, criarProduto, reservarProduto, entregarProduto, atualizarProduto, deletarProduto}