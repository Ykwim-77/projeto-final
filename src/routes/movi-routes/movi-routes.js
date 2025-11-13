import controller from '../../controllers/movi-controller/movi-controller.js';
import express from 'express';
import authMiddleware from '../../midllewares/authController.js';

const roteador_movi = express.Router();

roteador_movi.get("/", authMiddleware, (req, res) => {
    controller.pegarTodosMovis(req, res);
});

roteador_movi.get("/:id", authMiddleware, (req, res) => {
    controller.pegar1movi(req, res);
});

roteador_movi.post("/", authMiddleware, (req, res) => {
    controller.criarmovi(req, res);
});

roteador_movi.put("/:id", authMiddleware, (req, res) => {
    controller.atualizarmovi(req, res);
});

roteador_movi.delete("/:id", authMiddleware, (req, res) => {
    controller.deletarmovi(req, res);
});

export default roteador_movi;