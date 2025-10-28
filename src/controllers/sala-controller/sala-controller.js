import { PrismaClient } from "@prisma/client";
import { PegarApenasUm, Deletar } from "../../function.js";
import { create } from "domain";


const prisma = new PrismaClient();


async function pegarTodasSalas(req,res) {
    try {

        const salas = await prisma.sala.findMany();

        if (!salas) {
            return res.status(404).json({ mensagem: "Nenhuma sala encontrada." });
        }
        return res.status(200).json(salas);

    } catch (error) {

        console.error(error);

        return res.status(500).json({ mensagem: "Erro ao buscar salas." });
    }

}




async function pegar1Sala(req,res) {
    try {
        const sala = await PegarApenasUm('sala', 'id_sala', req.params.id);
        return res.status(200).json(sala);
    } catch (error) {
        return res.status(500).json({ mensagem: "Erro ao buscar sala.", dados:error.message });
    }       

}



async function criarSala(req,res) {
    const { nome_sala, descricao, capacidade,localizacao } = req.body;

    if (!nome_sala || !capacidade || !descricao || !localizacao) {
        return res.status(400).json({ mensagem: "Nome e capacidade são obrigatórios." });
    }

    try {

        const sala = await prisma.sala.create({

            data: {
                    nome_sala:nome_sala,
                    descricao:descricao,
                    capacidade:capacidade,
                    localizacao:localizacao
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

    const { nome_sala, descricao, capacidade, localizacao } = req.body;
    try {
        const sala = await prisma.sala.update({
            where:{
                id_sala:idnumber
            },
            data:{
                nome_sala:nome_sala,
                descricao:descricao,
                capacidade:capacidade,
                localizacao:localizacao
            }
        });
        return res.status(200).json(sala);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ mensagem: "Erro ao atualizar sala." });
    }
}


async function deletarSala(req,res) {

    try {
        const sala = await Deletar('sala', 'id_sala', req.params.id);

        return res.status(200).json({sala});

    }catch (error) {
        // Verifica o tipo de erro para retornar o status code apropriado
        if (error.message === "ID deve ser um número válido") {
            return res.status(400).json({ mensagem: error.message });

        } else if (error.message === "Registro não encontrado") {
            return res.status(404).json({ mensagem: error.message });

        } else {
            return res.status(500).json({ 
                mensagem: "Erro interno no servidor", 
                error: error.message 
            });
        }
    }
}

async function reservarSala(req,res) {

   const idNumber = parseInt(req.params.id);
    if (isNaN(idNumber)) {
        return res.status(400).json({ mensagem: "o id precisa ser um número inteiro" });
    }
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
