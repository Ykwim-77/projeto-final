import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Gera previsões simples baseado em `patrimonio` (estoque e min_estoque)
 */
async function gerarPrevisao(req, res) {
  try {
    const patrimonios = await prisma.patrimonio.findMany();

    const previsoes = patrimonios.map(p => {
      const precisaRepor = (p.estoque ?? 0) <= (p.min_estoque ?? 0);
      const sugestao = precisaRepor ? 'Repor estoque' : 'Estoque suficiente';
      const urgencia = precisaRepor ? (p.estoque === 0 ? 'alta' : 'média') : 'baixa';
      return {
        id_patrimonio: p.id_patrimonio,
        nome: p.nome,
        estoque: p.estoque,
        min_estoque: p.min_estoque,
        sugestao,
        urgencia
      };
    });

    return res.status(200).json(previsoes);
  } catch (error) {
    console.error('Erro ao gerar previsões:', error);
    return res.status(500).json({ mensagem: 'Erro ao gerar previsões', detalhes: error.message });
  }
}

export default { gerarPrevisao };
