import { PrismaClient } from "@prisma/client/extension";



const prisma = new PrismaClient();


async function pegarTodasSalas(req,res) {
    res.json(salas);

    if (!salas) {
        return res.status(404).json({ mensagem: "Nenhuma sala encontrada." });
    }

    try {
        await prisma.$connect();
        const salas = await prisma.sala.findMany();
        return res.status(200).json(salas);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar salas." });
    }

}

async function pegar1Sala(req,res) {
    const { id } = req.params;
    const sala = await prisma.sala.findUnique({
        where: { id: Number(id) }
    });
    res.json(sala);

    if (sala === null) {
        return res.status(404).json({ mensagem: "Sala não encontrada." });
    }
    return res.status(200).json(sala);
}


        try {
            await prisma.$connect();
            const sala = await prisma.sala.findUnique({
                where: { id: Number(id) }
            });
            if (sala === null) {
                return res.status(404).json({ mensagem: "Sala não encontrada." });
            }
            return res.status(200).json(sala);
        } catch (error) {
            return res.status(500).json({ mensagem: "Erro ao buscar sala." });
        }       
    

async function criarSala(req,res) {
    const { nome, capacidade } = req.body;
    const sala = await prisma.sala.create({
        data: { nome, capacidade }
    });
    res.json(sala);
}

async function atualizarSala(req,res) {
    const { id } = req.params;
    const { nome, capacidade } = req.body;
    const sala = await prisma.sala.update({
        where: { id: Number(id) },
        data: { nome, capacidade }
    });
    res.json(sala);
}

async function deletarSala(req,res) {
    const { id } = req.params;
    await prisma.sala.delete({
        where: { id: Number(id) }
    });
    res.sendStatus(204);
}

async function reservarSala(req,res) {
    const { id } = req.params;
    const reserva = await prisma.reserva.create({
        data: {
            sala: { connect: { id: Number(id) } },
            usuario: { connect: { id: req.user.id } }
        }
    });
    res.json(reserva);
}

async function liberarSala(req,res) {
    const { id } = req.params;
    await prisma.reserva.deleteMany({
        where: { salaId: Number(id) }
    });
    res.sendStatus(204);
}

export default {
    pegarTodasSalas,
    pegar1Sala,
    criarSala,
    atualizarSala,
    deletarSala,
    reservarSala,
    liberarSala
};
