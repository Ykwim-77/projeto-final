import controller from "../../controllers/sala-controller/sala-controller.js";
import express from "express";

const roteador_sala = express.Router();


roteador_sala.get("/", (req, res) => {
    controller.pegarTodasSalas(res, res);
});

roteador_sala.get("/:id", (req, res) => {
    controller.pegar1Sala(res, res);
});

roteador_sala.post("/", (req, res) => {
    controller.criarSala(res, res);
});

roteador_sala.post("/reservar/:id", (req, res) => {
    controller.reservarSala(res, res);
});

roteador_sala.post("/liberar/:id", (req, res) => {
    controller.liberarSala(res, res);
});

roteador_sala.put("/:id", (req, res) => {
    controller.atualizarSala(res, res);
});

roteador_sala.delete("/:id", (req, res) => {
    controller.deletarSala(res, res);
});

export default roteador_sala;