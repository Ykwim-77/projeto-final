import express from "express";
import moviController from "../../controllers/movi-controller/movi-controller.js";
const roteador_movi = express.Router();



roteador_movi.get("/", (req, res) => {
   moviController.pegarTodosMovis(req, res);
});

rotaedor_movi.get("/:id", (req, res) => {
   moviController.pegar1Movi(req, res);
});

roteador_movi.post("/", (req, res) => {
    moviController.criarmovi(req, res);
});

roteador_movi.put("/:id", (req, res) => {
    moviController.atualizarmovi(req, res);
});

roteador_movi.delete("/:id", (req, res) => {
    moviController.deletarmovi(req, res);
});

roteador_movi.post("/alugar/:id", (req, res) => {
    moviController.alugarmovi(req, res);
});

roteador_movi.post("/devolver/:id", (req, res) => { 
    moviController.devolvermovi(req, res);
});

export default roteador_movi