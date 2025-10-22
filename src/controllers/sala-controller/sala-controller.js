import { PrismaClient } from "@prisma/client/extension";



const prisma = new PrismaClient();


async function pegarTodasSalas(req,res) {

    res.json(salas);

    if (!salas) {

        return res.status(404).json({ mensagem: "Nenhuma sala encontrada." });
    }


    try {
        
        const salas = await prisma.sala.findMany();

        return res.status(200).json(salas);

    } catch (error) {

        console.error(error);

        return res.status(500).json({ mensagem: "Erro ao buscar salas." });
    }

}




async function pegar1Sala(req,res) {

    const id_number = parseInt(req.params.id);

    if (isNaN(id_number)) {

        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });

    }

    try {

        const sala = await prisma.sala.findUnique({

            where: { id: id_number }

        });

        if (!sala) {

            return res.status(404).json({ mensagem: "Sala não encontrada." });

        }

        return res.status(200).json(sala);

    } catch (error) {

        console.error(error);

        return res.status(500).json({ mensagem: "Erro ao buscar sala." });

    }
}

async function criarSala(req,res) {

    const { nome, capacidade } = req.body;

    if (!nome || !capacidade) {

        return res.status(400).json({ mensagem: "Nome e capacidade são obrigatórios." });

    }

    try {

        const sala = await prisma.sala.create({

            data: {

                    nome, 
                    capacidade,
                    reservas: { create: [] }

                }

        });

        return res.status(201).json(sala);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao criar sala." });

    }

}



async function atualizarSala(req,res) {

    const idnumber = parseInt(req.params.id);

    if (isNaN(idnumber)) {

        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });

    }
    try {

        const sala = await prisma.sala.update({

            where: { id: idnumber },

            data: { nome, capacidade }
        });

        return res.status(200).json(sala);

    } catch (error) {

        console.error(error);

        return res.status(500).json({ mensagem: "Erro ao atualizar sala." });

    }
}


async function deletarSala(req,res) {

    const iddelete = parseInt(req.params.id);

    if (isNaN(iddelete)) {

        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });

    }


    try {

        await prisma.sala.delete({

            where: { id: iddelete }

        });

        return res.sendStatus(204);

    } catch (error) {

        console.error(error);

        return res.status(500).json({ mensagem: "Erro ao deletar sala." });

    }

}

async function reservarSala(req,res) {

   const id = parseInt(req.params.id);

   const { data_reserva, hora_inicio, hora_fim, nome_reservante } = req.body;

   if (isNaN(id)) {

       return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });
   }

   try {
    
       const reserva = await prisma.reserva.create({

           data: {

               sala: { connect: { id: id } },
               usuario: { connect: { id: req.user.id } },
               data_reserva,
               hora_inicio,
               hora_fim,
               nome_reservante
           }

       });

       res.status(201).json(reserva);

   } catch (error) {

       console.error(error);

       res.status(500).json({ mensagem: "Erro ao reservar sala." });

   }

}


async function liberarSala(req,res) {

    const id = parseInt(req.params.id);

    if (isNaN(id)) {

        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });
    }

    try {

        await prisma.reserva.deleteMany({

            where: { salaId: id }

        });

        res.sendStatus(204);

    } catch (error) {

        console.error(error);
        
        res.status(500).json({ mensagem: "Erro ao liberar sala." });
    }
}

export default { pegarTodasSalas, pegarTodasSalas, pegar1Sala, criarSala, atualizarSala, deletarSala, reservarSala, liberarSala};
