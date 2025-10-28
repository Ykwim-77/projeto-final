import jwt from "jsonwebtoken";



const SECRET = "meusegredoseguro"; // isso ficaria num .env

export function verificarToken(req, res, next) {
  const token = req.headers["authorization"]; // pega o token do header

  if (!token) {
    return res.status(403).json({ erro: "Token não fornecido" });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ erro: "Token inválido" });
    }

    // guarda o ID do usuário dentro do req
    req.userId = decoded.id;
    next(); // segue pra próxima função/rota
  });
}

