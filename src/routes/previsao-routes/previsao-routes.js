import controller from '../../controllers/previsao-controller/previsao-controller.js';
import express from 'express';
import authMiddleware from '../../midllewares/authController.js';

const router = express.Router();

router.get('/', authMiddleware, (req, res) => controller.gerarPrevisao(req, res));

export default router;
