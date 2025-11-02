import controller from "../../controllers/sala-controller/sala-controller.js";
import express from "express";

const roteador_sala = express.Router();


roteador_sala.get("/", (req, res) => {
    controller.pegarTodasSalas(req, res);
});

roteador_sala.get("/:id", (req, res) => {
    controller.pegar1Sala(req, res);
});

roteador_sala.post("/", (req, res) => {
    controller.criarSala(req, res);
});

roteador_sala.post("/reservar/:id", (req, res) => {
    controller.reservarSala(req, res);
});

roteador_sala.post("/liberar/:id", (req, res) => {
    controller.liberarSala(req, res);
});

roteador_sala.put("/:id", (req, res) => {
    controller.atualizarSala(req, res);
});

roteador_sala.delete("/:id", (req, res) => {
    controller.deletarSala(req, res);
});

export default roteador_sala;