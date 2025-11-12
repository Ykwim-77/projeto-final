import { PrismaClient } from "@prisma/client";  
import { PegarApenasUm, Deletar } from "../../function.js";
import { create } from "domain";

const prisma = new PrismaClient();

async function pegarTodosMovis(req,res) {
    try {

        const movis = await prisma.movi.findMany();
        if (!movis) {
            return res.status(404).json({ mensagem: "Nenhum movi encontrado." });
        }
        return res.status(200).json(movis);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar movis." });
    }

}