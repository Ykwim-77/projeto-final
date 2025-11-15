import { PrismaClient } from "@prisma/client";  
import { PegarApenasUm, Deletar } from "../../function.js";

const prisma = new PrismaClient();

/**
 * Lista todos os empréstimos (movimentações com tipo_movimentacao = 'emprestimo')
 */
async function pegarTodosMovis(req, res) {
    try {
        const emprestimos = await prisma.movimentacao.findMany({
            where: {
                tipo_movimentacao: 'emprestimo'
            },
            include: {
                patrimonio: true,
                usuario: true
            }
        });

        if (emprestimos.length === 0) {
            return res.status(200).json([]);
        }
        
        // Filtrar apenas movimentacoes com patrimonio e usuario válidos
        const filtrados = emprestimos.filter(e => e.patrimonio !== null && e.usuario !== null);
        return res.status(200).json(filtrados);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar empréstimos." });
    }
}

/**
 * Busca um empréstimo específico por ID
 */
async function pegar1movi(req, res) {
    try {
        const emprestimo = await prisma.movimentacao.findUnique({
            where: { 
                id_movimentacao: parseInt(req.params.id)
            },
            include: {
                patrimonio: true,
                usuario: true
            }
        });

        if (!emprestimo || emprestimo.tipo_movimentacao !== 'emprestimo') {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }
        return res.status(200).json(emprestimo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar empréstimo.", dados: error.message });
    }
}

/**
 * Cria um novo empréstimo
 */
async function criarmovi(req, res) {
    const { id_patrimonio, id_usuario, origem, observacao, status } = req.body;

    // Validar campos obrigatórios
    if (!id_patrimonio || !id_usuario) {
        return res.status(400).json({ mensagem: "ID do patrimônio e do usuário são obrigatórios." });
    }

    try {
        // Verificar se o patrimônio existe
        const patrimonio = await prisma.patrimonio.findUnique({
            where: { id_patrimonio: parseInt(id_patrimonio) }
        });

        if (!patrimonio) {
            return res.status(404).json({ mensagem: "Patrimônio não encontrado." });
        }

        // Verificar se o usuário existe
        const usuario = await prisma.usuario.findUnique({
            where: { id_usuario: parseInt(id_usuario) }
        });

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        // Criar empréstimo
        const emprestimo = await prisma.movimentacao.create({
            data: {
                id_patrimonio: parseInt(id_patrimonio),
                id_usuario: parseInt(id_usuario),
                tipo_movimentacao: 'emprestimo',
                origem: origem || patrimonio.nome,
                data_movimento: new Date(),
                status: status || 'ativo',
                observacao: observacao || null
            },
            include: {
                patrimonio: true,
                usuario: true
            }
        });

        return res.status(201).json(emprestimo);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao criar empréstimo.", dados: error.message });
    }
}

/**
 * Atualiza um empréstimo existente
 */
async function atualizarmovi(req, res) {
    const { status, observacao } = req.body;
    const id = parseInt(req.params.id);

    try {
        // Verificar se o empréstimo existe
        const emprestimo = await prisma.movimentacao.findUnique({
            where: { id_movimentacao: id }
        });

        if (!emprestimo || emprestimo.tipo_movimentacao !== 'emprestimo') {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }

        // Atualizar empréstimo
        const emprestimoAtualizado = await prisma.movimentacao.update({
            where: { id_movimentacao: id },
            data: {
                ...(status && { status }),
                ...(observacao !== undefined && { observacao })
            },
            include: {
                patrimonio: true,
                usuario: true
            }
        });

        return res.status(200).json(emprestimoAtualizado);
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar empréstimo.", dados: error.message });
    }
}

/**
 * Deleta um empréstimo
 */
async function deletarmovi(req, res) {
    const id = parseInt(req.params.id);

    try {
        // Verificar se o empréstimo existe
        const emprestimo = await prisma.movimentacao.findUnique({
            where: { id_movimentacao: id }
        });

        if (!emprestimo || emprestimo.tipo_movimentacao !== 'emprestimo') {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }

        // Deletar empréstimo
        await prisma.movimentacao.delete({
            where: { id_movimentacao: id }
        });

        return res.status(200).json({ mensagem: "Empréstimo deletado com sucesso." });
    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao deletar empréstimo.", dados: error.message });
    }
}

export default { pegarTodosMovis, pegar1movi, criarmovi, atualizarmovi, deletarmovi };