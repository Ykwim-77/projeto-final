import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function PegarApenasUm(tabela, id_campo, id) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
        throw new Error('ID_INVÁLIDO');
    }
    try {
        const registro = await prisma[tabela].findUnique({
            where: {
                [id_campo]: idNumber
            }
        });
        return registro; // pode ser null
    } catch (error) {
        throw error;
    }
}




async function pegarTudo(tabela, filtro = {}) {
    try {
        const resultados = await prisma[tabela].findMany({ where: filtro });
        return resultados;
    } catch (error) {
        throw error;
    }
}

async function Deletar(tabela, id_campo, id) {
    const idNumber = parseInt(id);
    if (isNaN(idNumber)) {
        throw new Error('ID_INVÁLIDO');
    }
    try {
        const deleted = await prisma[tabela].delete({
            where: {
                [id_campo]: idNumber
            }
        });
        return deleted;
    } catch (error) {
        throw error;
    }
}




export { PegarApenasUm, Deletar, pegarTudo };