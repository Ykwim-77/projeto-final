import controller from '../../controllers/movi-controller/movi-controller.js';
import express from 'express';

const roteador_movi = express.Router();

roteador_movi.get("/", (req, res) => {
    controller.pegarTodosMovis(req, res);
});

roteador_movi.get("/:id", (req, res) => {
    controller.pegar1movi(req, res);
});

roteador_movi.post("/", (req, res) => {
    controller.criarmovi(req, res);
});

roteador_movi.put("/:id", (req, res) => {
    controller.atualizarmovi(req, res);
});

roteador_movi.delete("/:id", (req, res) => {
    controller.deletarmovi(req, res);
});

export default roteador_movi;