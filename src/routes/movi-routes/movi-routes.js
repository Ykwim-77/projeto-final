import express from "express";

const roteador_movi = express.Router();



roteador_movi.get("/", (req, res) => {
    controller.pegarTodasSalas(req, res);
});


export default roteador_movi