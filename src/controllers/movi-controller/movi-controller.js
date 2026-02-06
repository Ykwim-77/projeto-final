import { PrismaClient } from "@prisma/client";  
import { PegarApenasUm, Deletar } from "../../function.js";

const prisma = new PrismaClient();

/**
 * Lista todas as movimentações
 */
async function pegarTodosMovis(req, res) {
    try {
        // Buscar todas as movimentações sem filtro
        const movimentacoes = await prisma.movimentacao.findMany({ take: 100, skip: 0 });

        if (movimentacoes.length === 0) {
            return res.status(200).json([]);
        }
        
        // Carregar usuario e patrimonio para cada movimentacao de forma segura
        const resultado = await Promise.all(movimentacoes.map(async (m) => {
            let usuario = null;
            let patrimonio = null;
            try {
                usuario = await prisma.usuario.findUnique({ where: { id_usuario: m.id_usuario } });
            } catch (err) {
                console.warn('Não foi possível carregar usuário para movimentação', m.id_movimentacao, err.message);
            }
            if (m.id_patrimonio) {
                try {
                    patrimonio = await prisma.patrimonio.findUnique({ where: { id_patrimonio: m.id_patrimonio } });
                } catch (err) {
                    console.warn('Não foi possível carregar patrimônio para movimentação', m.id_movimentacao, err.message);
                }
            }

        // Mapeamento para compatibilidade com frontend
        const tipo = m.tipo_movimentacao === 'emprestimo' ? 'saida' : 'entrada';
        const quantidade = m.quantidade || 1; // Usar quantidade do empréstimo se disponível

        return {
            ...m,
            usuario,
            patrimonio,
            // Campos de compatibilidade para o frontend
            produtoNome: patrimonio ? patrimonio.nome : 'Produto não encontrado',
            tipo: tipo,
            quantidade: quantidade,
            data: m.data_movimento,
            usuarioNome: usuario ? usuario.nome : 'Usuário não encontrado',
            // Campos adicionais para compatibilidade
            produto: patrimonio ? patrimonio.nome : 'Produto não encontrado',
            usuario: usuario ? usuario.nome : 'Usuário não encontrado',
            dataEmprestimo: m.data_movimento ? new Date(m.data_movimento).toLocaleDateString('pt-BR') : null,
            dataDevolucao: null, // Movimentações não têm data de devolução
            departamento: usuario ? usuario.tipo_usuario : null,
            contato: usuario ? usuario.email : null
        };
        }));

        return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar movimentações." });
    }
}

/**
 * Busca uma movimentação específica por ID
 */
async function pegar1movi(req, res) {
    try {
        const id = parseInt(req.params.id);
        const movimentacao = await prisma.movimentacao.findUnique({
            where: { 
                id_movimentacao: id
            }
        });

        if (!movimentacao) {
            return res.status(404).json({ mensagem: "Movimentação não encontrada." });
        }

        // Carregar usuario e patrimonio separadamente
        let usuario = null;
        let patrimonio = null;
        try {
            usuario = await prisma.usuario.findUnique({ where: { id_usuario: movimentacao.id_usuario } });
        } catch (err) {
            console.warn('Não foi possível carregar usuário', err.message);
        }
        if (movimentacao.id_patrimonio) {
            try {
                patrimonio = await prisma.patrimonio.findUnique({ where: { id_patrimonio: movimentacao.id_patrimonio } });
            } catch (err) {
                console.warn('Não foi possível carregar patrimônio', err.message);
            }
        }

        // Mapeamento para compatibilidade com frontend
        const tipo = movimentacao.tipo_movimentacao === 'emprestimo' ? 'saida' : 'entrada';
        const quantidade = movimentacao.quantidade || 1; // Usar quantidade do empréstimo se disponível

        return res.status(200).json({
            ...movimentacao,
            usuario,
            patrimonio,
            // Campos de compatibilidade para o frontend
            produtoNome: patrimonio ? patrimonio.nome : 'Produto não encontrado',
            tipo: tipo,
            quantidade: quantidade,
            data: movimentacao.data_movimento,
            usuarioNome: usuario ? usuario.nome : 'Usuário não encontrado'
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar movimentação.", dados: error.message });
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
        // Criar empréstimo e ajustar estoque (transacional)
        const emprestimo = await prisma.$transaction(async (tx) => {
            const mov = await tx.movimentacao.create({
                data: {
                    id_patrimonio: parseInt(id_patrimonio),
                    id_usuario: parseInt(id_usuario),
                    tipo_movimentacao: 'emprestimo',
                    origem: origem || patrimonio.nome,
                    data_movimento: new Date(),
                    status: status || 'ativo',
                    observacao: observacao || null
                }
            });

            // Diminuir estoque do patrimônio em 1 (emprestimo)
            await tx.patrimonio.update({ where: { id_patrimonio: patrimonio.id_patrimonio }, data: { estoque: { decrement: 1 } } });

            // Recarregar relacionamentos para resposta
            const movWithIncludes = await tx.movimentacao.findUnique({
                where: { id_movimentacao: mov.id_movimentacao },
                include: { patrimonio: true, usuario: true }
            });

            return movWithIncludes;
        });

        // Mapeamento para compatibilidade com frontend
        const tipo = emprestimo.tipo_movimentacao === 'emprestimo' ? 'saida' : 'entrada';
        const quantidade = emprestimo.quantidade || 1; // Usar quantidade do empréstimo se disponível

        return res.status(201).json({
            ...emprestimo,
            // Campos de compatibilidade para o frontend
            produtoNome: patrimonio ? patrimonio.nome : 'Produto não encontrado',
            tipo: tipo,
            quantidade: quantidade,
            data: emprestimo.data_movimento,
            usuarioNome: usuario ? usuario.nome : 'Usuário não encontrado'
        });
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

        // Atualizar empréstimo e ajustar estoque se necessário (transação)
        const emprestimoAtualizado = await prisma.$transaction(async (tx) => {
            // Se for alteração para devolvido, restaurar estoque
            if (status === 'devolvido') {
                const atual = await tx.movimentacao.findUnique({ where: { id_movimentacao: id } });
                if (atual && atual.id_patrimonio) {
                    await tx.patrimonio.update({ where: { id_patrimonio: atual.id_patrimonio }, data: { estoque: { increment: 1 } } });
                }
            }

            const updated = await tx.movimentacao.update({
                where: { id_movimentacao: id },
                data: {
                    ...(status && { status }),
                    ...(observacao !== undefined && { observacao })
                }
            });

            // Recarregar relacionamentos
            const data = await tx.movimentacao.findUnique({ where: { id_movimentacao: id }, include: { patrimonio: true, usuario: true } });
            return data;
        });

        // Mapeamento para compatibilidade com frontend
        const tipo = emprestimoAtualizado.tipo_movimentacao === 'emprestimo' ? 'saida' : 'entrada';
        const quantidade = emprestimoAtualizado.quantidade || 1; // Usar quantidade do empréstimo se disponível

        return res.status(200).json({
            ...emprestimoAtualizado,
            // Campos de compatibilidade para o frontend
            produtoNome: emprestimoAtualizado.patrimonio ? emprestimoAtualizado.patrimonio.nome : 'Produto não encontrado',
            tipo: tipo,
            quantidade: quantidade,
            data: emprestimoAtualizado.data_movimento,
            usuarioNome: emprestimoAtualizado.usuario ? emprestimoAtualizado.usuario.nome : 'Usuário não encontrado'
        });
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