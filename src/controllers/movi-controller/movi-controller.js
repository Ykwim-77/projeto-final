<<<<<<< HEAD
import { PrismaClient } from "@prisma/client";  
import { PegarApenasUm, Deletar } from "../../function.js";
import { create } from "domain";

const prisma = new PrismaClient();

async function pegarTodosMovis(req,res) {
=======
import { Prisma } from "@prisma/client";   
import { PegarApenasUm, Deletar } from "../../function.js";

const prisma = new Prisma.Client();

async function pegarTodosMovis(req,res) {  
>>>>>>> ab7f82403676e0166f66de620c58cb23ec5e610c
    try {

        const movis = await prisma.movi.findMany();
        if (!movis) {
<<<<<<< HEAD
            return res.status(404).json({ mensagem: "Nenhum movi encontrado." });
        }
        return res.status(200).json(movis);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar movis." });
    }

}
=======
            return res.status(404).json({ mensagem: "Nenhum movis encontrado." });
        }
        return res.status(200).json(movis);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar movis." });
    }   
}

async function pegar1Movi(req,res) {
    try {
        const movi = await PegarApenasUm('movi', 'id_movi', req.params.id);
        return res.status(200).json(movi);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar movi.", dados:error.message });
    }
}       

async function criarmovi(req,res) {
    const { titulo, genero, duracao, classificacao } = req.body;
    if (!titulo || !genero || !duracao || !classificacao) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios." });
    }   
    try {
        const movi = await prisma.movi.create({
            data: {
                titulo: titulo,
                genero: genero,
                duracao: duracao,
                classificacao: classificacao
            }
        });
        return res.status(201).json(movi);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao criar movi." });
    }
}
>>>>>>> ab7f82403676e0166f66de620c58cb23ec5e610c
