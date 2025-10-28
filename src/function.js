import { PrismaClient } from "@prisma/client";
import { response } from "express";

const prisma = new PrismaClient();

async function PegarApenasUm(tabela, id_campo, id){
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });
    }
    console.log(tabela, id_campo, id)
    try{
        const ApenasUm = await prisma[tabela].findUnique({
            where:{
                [id_campo]: idNumber
            }
        })

        if(ApenasUm === null){
            return res.status(404).json({mensagem: "Nao encontrado"})
        }
        return ApenasUm
    }catch(error){
        return res.satus(500)   
    }

}




async function pegarTudo(params) {
    
}

async function Deletar(tabela, id_campo, id) {
    const idNumber = parseInt(id);
    if(isNaN(idNumber)){ // verifica se o id é do tipo number
         throw new Error("ID deve ser um número válido");
    }

    const deletado = await prisma[tabela].findUnique({
        where:{
            [id_campo]: idNumber
        }
    })
    if(!deletado){
        throw new Error("Registro não encontrado");
    }
    console.log(deletado)
    await prisma[tabela].delete({
        where:{
            [id_campo]: idNumber
        }
    })
    
    return {
        mensagem: `${deletado.nome} da tabela ${tabela} foi Deletado com sucesso`
    }

}




export  {PegarApenasUm, Deletar}