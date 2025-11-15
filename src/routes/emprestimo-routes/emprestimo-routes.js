import controller from '../../controllers/emprestimo-controller/emprestimo-controller.js';
import express from 'express';
import authMiddleware from '../../midllewares/authController.js';

const roteador_emprestimo = express.Router();

/**
 * GET /emprestimo - Lista todos os empréstimos
 */
roteador_emprestimo.get("/", authMiddleware, (req, res) => {
    controller.listarEmprestimos(req, res);
});

/**
 * GET /emprestimo/:id - Busca um empréstimo específico
 */
roteador_emprestimo.get("/:id", authMiddleware, (req, res) => {
    controller.buscarEmprestimo(req, res);
});

/**
 * POST /emprestimo - Cria um novo empréstimo
 */
roteador_emprestimo.post("/", authMiddleware, (req, res) => {
    controller.criarEmprestimo(req, res);
});

/**
 * PUT /emprestimo/:id - Atualiza um empréstimo
 */
roteador_emprestimo.put("/:id", authMiddleware, (req, res) => {
    controller.atualizarEmprestimo(req, res);
});

/**
 * DELETE /emprestimo/:id - Deleta um empréstimo
 */
roteador_emprestimo.delete("/:id", authMiddleware, (req, res) => {
    controller.deletarEmprestimo(req, res);
});

export default roteador_emprestimo;
