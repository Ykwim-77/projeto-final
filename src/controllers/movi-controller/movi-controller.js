import { PrismaClient } from "@prisma/client";  
import { PegarApenasUm, Deletar } from "../../function.js";

const prisma = new PrismaClient();

async function pegarTodosMovis(req,res) {
    try {

        const movis = await prisma.movi.findMany();
        if (movis.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum movi encontrado." });
        }
        return res.status(200).json(movis);

    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar movis." });
    }

}

async function pegar1movi(req, res) {
    try {
        const movi = await PegarApenasUm('movimentacao', 'id', req.params.id);
        if (!movi) {
            return res.status(404).json({ mensagem: "Movi não encontrado." });
        }
        return res.status(200).json(movi);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar movi.", dados: error.message });
    }
}

async function criarmovi(req, res) {
    const { entrada, saida, id_sala } = req.body;

    if (!entrada || !saida || !id_sala) {
        return res.status(400).json({ mensagem: "Entrada, saída e ID da sala são obrigatórios." });
    }

    if (new Date(saida) <= new Date(entrada)) {
        return res.status(400).json({ mensagem: "A data de saída deve ser posterior à data de entrada." });
    }

    try {
        const salaExistente = await prisma.sala.findUnique({
            where: { id: id_sala }
        });

        if (!salaExistente) {
            return res.status(404).json({ mensagem: "Sala não encontrada." });
        }
    const movi = await prisma.movimentacao.create({
            data: {
                entrada: new Date(entrada),
                saida: new Date(saida),
                id_sala: id_sala
            }
        });
        return res.status(201).json(movi);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao criar movi." });
    }
}

async function atualizarmovi(req, res) {
    const { entrada, saida, id_sala } = req.body;
    const id = req.params.id;

    try {
        const movi = await prisma.movimentacao.update({
            where: { id: id }, 
            data: {
                ...(entrada && { entrada: new Date(entrada) }),
                ...(saida && { saida: new Date(saida) }),
                ...(id_sala && { id_sala: id_sala })
            }
        });
        return res.status(200).json(movi);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensagem: "Movi não encontrado." });
        }
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar movi." });
    }
}

async function deletarmovi(req, res) {
    const id = req.params.id;   

    Deletar('movimentacao', 'id', id, res);
}


export default { pegarTodosMovis, pegar1movi, criarmovi, atualizarmovi, deletarmovi };