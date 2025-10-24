import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function PegarApenasUm(tabela, id_campo, id){
    try{
        const ApenasUm = await prisma[tabela].findUnique({
            where:{
                [id_campo]: id
            }
        })
        console.log(ApenasUm);
        return ApenasUm
    }catch(error){
        return res.satus(500)   
    }

}

export  {PegarApenasUm}