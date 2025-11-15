import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Lista todos os empréstimos
 */
async function listarEmprestimos(req, res) {
    try {
        

            // Buscar sem include para evitar erro quando relações estão inconsistentes
            const emprestimos = await prisma.emprestimo.findMany({ take: 100, skip: 0 });

            if (!emprestimos || emprestimos.length === 0) return res.status(200).json([]);

            // Para cada empréstimo, tentar carregar usuario e patrimonio individualmente (tolerante a null)
            const resultado = await Promise.all(emprestimos.map(async (e) => {
                let usuario = null;
                let patrimonio = null;

                try {
                    usuario = await prisma.usuario.findUnique({ where: { id_usuario: e.id_usuario } });
                } catch (err) {
                    console.warn('Não foi possível buscar usuário para empréstimo', e.id_emprestimo, err.message);
                }

                if (e.id_patrimonio) {
                    try {
                        const p = await prisma.patrimonio.findUnique({ where: { id_patrimonio: e.id_patrimonio } });
                        if (p) patrimonio = { id_patrimonio: p.id_patrimonio, nome: p.nome, estoque: p.estoque, status: p.status };
                    } catch (err) {
                        console.warn('Não foi possível buscar patrimônio para empréstimo', e.id_emprestimo, err.message);
                    }
                }

                return {
                    ...e,
                    id_emprestimo: e.id_emprestimo,
                    id_patrimonio: e.id_patrimonio || null,
                    patrimonio,
                    usuario
                };
            }));

            return res.status(200).json(resultado);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar empréstimos.", dados: error.message });
    }
}

/**
 * Busca um empréstimo específico por ID
 */
async function buscarEmprestimo(req, res) {
    try {
        const id = parseInt(req.params.id);
        const emprestimo = await prisma.emprestimo.findUnique({ where: { id_emprestimo: id } });

        if (!emprestimo) {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }

        // carregar usuario e patrimonio de forma tolerante
        let usuario = null;
        let patrimonio = null;
        try {
            usuario = await prisma.usuario.findUnique({ where: { id_usuario: emprestimo.id_usuario } });
        } catch (err) {
            console.warn('Não foi possível carregar usuário do empréstimo', id, err.message);
        }

        if (emprestimo.id_patrimonio) {
            try {
                const p = await prisma.patrimonio.findUnique({ where: { id_patrimonio: emprestimo.id_patrimonio } });
                if (p) patrimonio = { id_patrimonio: p.id_patrimonio, nome: p.nome, estoque: p.estoque, status: p.status };
            } catch (err) {
                console.warn('Não foi possível carregar patrimônio do empréstimo', id, err.message);
            }
        }

        return res.status(200).json({ ...emprestimo, usuario, patrimonio });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao buscar empréstimo.", dados: error.message });
    }
}

/**
 * Cria um novo empréstimo
 */
async function criarEmprestimo(req, res) {
    console.log('CriarEmprestimo - corpo da requisição:', req.body);
    const { data_pedido, valor_total, status, observacoes, id_usuario, id_patrimonio, quantidade } = req.body;

    // Validar campos obrigatórios
    if (!id_usuario) {
        return res.status(400).json({ mensagem: "ID do usuário é obrigatório." });
    }

    try {
        // Verificar se o usuário existe
        const usuario = await prisma.usuario.findUnique({
            where: { id_usuario: parseInt(id_usuario) }
        });

        if (!usuario) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }

        // Criar empréstimo e ajustar estoque se for um patrimônio
        const qty = parseInt(quantidade) || 1;

        if (id_patrimonio) {
            const idPat = parseInt(id_patrimonio);
            const patrimonio = await prisma.patrimonio.findUnique({ where: { id_patrimonio: idPat } });
            if (!patrimonio) return res.status(404).json({ mensagem: 'Patrimônio não encontrado.' });
            if ((patrimonio.estoque ?? 0) < qty) return res.status(400).json({ mensagem: 'Estoque insuficiente para este empréstimo.' });

            const created = await prisma.$transaction(async (tx) => {
                // criar empréstimo SEM include (evita erro de relação inconsistente)
                const emp = await tx.emprestimo.create({
                    data: {
                        data_pedido: data_pedido ? new Date(data_pedido) : new Date(),
                        data_recebimento: null,
                        valor_total: valor_total || 0,
                        status: status || 'ativo',
                        observacoes: observacoes || null,
                        id_usuario: parseInt(id_usuario),
                        id_patrimonio: idPat,
                        quantidade: qty
                    }
                });

                // atualizar estoque do patrimônio (diminuir)
                await tx.patrimonio.update({ where: { id_patrimonio: idPat }, data: { estoque: (patrimonio.estoque ?? 0) - qty } });
                return emp;
            });

            // carregar usuario e patrimonio separadamente de forma segura
            const usr = await prisma.usuario.findUnique({ where: { id_usuario: parseInt(id_usuario) } });
            const pat = await prisma.patrimonio.findUnique({ where: { id_patrimonio: idPat } });

            return res.status(201).json({
                ...created,
                usuario: usr,
                patrimonio: pat
            });
        } else {
            const emprestimo = await prisma.emprestimo.create({
                data: {
                    data_pedido: data_pedido ? new Date(data_pedido) : new Date(),
                    data_recebimento: null,
                    valor_total: valor_total || 0,
                    status: status || 'ativo',
                    observacoes: observacoes || null,
                    id_usuario: parseInt(id_usuario),
                    quantidade: qty
                }
            });

            // carregar usuario separadamente
            const usr = await prisma.usuario.findUnique({ where: { id_usuario: parseInt(id_usuario) } });

            return res.status(201).json({
                ...emprestimo,
                usuario: usr,
                patrimonio: null
            });
        }
    } catch (error) {
        console.error('Erro em criarEmprestimo:', error);
        console.error(error.stack);
        return res.status(500).json({ mensagem: "Erro ao criar empréstimo.", dados: error.message, stack: error.stack });
    }
}

/**
 * Atualiza um empréstimo existente
 */
async function atualizarEmprestimo(req, res) {
    const { data_recebimento, valor_total, status, observacoes, id_patrimonio } = req.body;
    const id = parseInt(req.params.id);
    const quantidade = req.body.quantidade !== undefined ? parseInt(req.body.quantidade) : undefined;

    try {
        // Verificar se o empréstimo existe
        const emprestimo = await prisma.emprestimo.findUnique({
            where: { id_emprestimo: id }
        });

        if (!emprestimo) {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }

        // Lógica para ajustar estoque caso id_patrimonio ou quantidade mudem, ou em caso de devolução
        const emprestimoAtual = await prisma.emprestimo.findUnique({ where: { id_emprestimo: id } });
        if (!emprestimoAtual) return res.status(404).json({ mensagem: 'Empréstimo não encontrado.' });

        // Função para aplicar alterações de estoque se necessário
        const applyStockChanges = async (tx) => {
            // se mudou o patrimônio ou a quantidade, ajusta estoques
            const oldPat = emprestimoAtual.id_patrimonio;
            const oldQty = emprestimoAtual.quantidade ?? 0;
            const newPat = id_patrimonio !== undefined ? (id_patrimonio ? parseInt(id_patrimonio) : null) : oldPat;
            const newQty = quantidade !== undefined ? quantidade : oldQty;

            // Se patrimônio mudou
            if (oldPat && newPat && oldPat === newPat) {
                const diff = newQty - oldQty;
                if (diff > 0) {
                    const p = await tx.patrimonio.findUnique({ where: { id_patrimonio: newPat } });
                    if ((p.estoque ?? 0) < diff) throw new Error('Estoque insuficiente para aumentar quantidade');
                    await tx.patrimonio.update({ where: { id_patrimonio: newPat }, data: { estoque: (p.estoque ?? 0) - diff } });
                } else if (diff < 0) {
                    await tx.patrimonio.update({ where: { id_patrimonio: newPat }, data: { estoque: { increment: -diff } } });
                }
            } else {
                // patrimônio alterado: devolver ao antigo e reduzir no novo
                if (oldPat) {
                    await tx.patrimonio.update({ where: { id_patrimonio: oldPat }, data: { estoque: { increment: oldQty } } });
                }
                if (newPat) {
                    const pNew = await tx.patrimonio.findUnique({ where: { id_patrimonio: newPat } });
                    if (!pNew) throw new Error('Patrimônio destino não encontrado');
                    if ((pNew.estoque ?? 0) < newQty) throw new Error('Estoque insuficiente no patrimônio destino');
                    await tx.patrimonio.update({ where: { id_patrimonio: newPat }, data: { estoque: (pNew.estoque ?? 0) - newQty } });
                }
            }
        };

        try {
            const updated = await prisma.$transaction(async (tx) => {
                // Se o status mudou para devolvido, devolve estoque
                if (status === 'devolvido' && emprestimoAtual.status !== 'devolvido' && emprestimoAtual.id_patrimonio) {
                    await tx.patrimonio.update({ 
                        where: { id_patrimonio: emprestimoAtual.id_patrimonio }, 
                        data: { estoque: { increment: emprestimoAtual.quantidade ?? 0 } } 
                    });
                }

                // aplicar mudanças de estoque se necessário
                await applyStockChanges(tx);

                const updatedEmp = await tx.emprestimo.update({
                    where: { id_emprestimo: id },
                    data: {
                        ...(data_recebimento && { data_recebimento: new Date(data_recebimento) }),
                        ...(valor_total !== undefined && { valor_total }),
                        ...(status && { status }),
                        ...(observacoes !== undefined && { observacoes }),
                        ...(id_patrimonio !== undefined && { id_patrimonio: id_patrimonio ? parseInt(id_patrimonio) : null }),
                        ...(quantidade !== undefined && { quantidade })
                    }
                });

                return updatedEmp;
            });

            // carregar usuario e patrimonio separadamente
            let usuario = null;
            let patrimonio = null;
            try {
                usuario = await prisma.usuario.findUnique({ where: { id_usuario: updated.id_usuario } });
            } catch (err) {
                console.warn('Não foi possível carregar usuário', err.message);
            }
            if (updated.id_patrimonio) {
                try {
                    patrimonio = await prisma.patrimonio.findUnique({ where: { id_patrimonio: updated.id_patrimonio } });
                } catch (err) {
                    console.warn('Não foi possível carregar patrimônio', err.message);
                }
            }

            return res.status(200).json({ ...updated, usuario, patrimonio });
        } catch (err) {
            console.error('Erro ao atualizar empréstimo com estoque:', err);
            return res.status(400).json({ mensagem: err.message || 'Erro ao atualizar empréstimo' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar empréstimo.", dados: error.message });
    }
}

/**
 * Deleta um empréstimo
 */
async function deletarEmprestimo(req, res) {
    const id = parseInt(req.params.id);

    try {
        // Verificar se o empréstimo existe
        const emprestimo = await prisma.emprestimo.findUnique({
            where: { id_emprestimo: id }
        });

        if (!emprestimo) {
            return res.status(404).json({ mensagem: "Empréstimo não encontrado." });
        }

        // Deletar empréstimo
        await prisma.emprestimo.delete({
            where: { id_emprestimo: id }
        });

        return res.status(200).json({ mensagem: "Empréstimo deletado com sucesso." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao deletar empréstimo.", dados: error.message });
    }
}

export default { 
    listarEmprestimos, 
    buscarEmprestimo, 
    criarEmprestimo, 
    atualizarEmprestimo, 
    deletarEmprestimo 
};
