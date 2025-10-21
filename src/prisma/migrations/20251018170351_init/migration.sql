-- CreateTable
CREATE TABLE "garantia" (
    "id_garantia" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "id_produto" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "data_inicio" DATETIME NOT NULL,
    "data_fim" DATETIME NOT NULL,
    "descricao" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Ativa',
    CONSTRAINT "garantia_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "produto" ("id_produto") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "garantia_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);
