/*
  Warnings:

  - You are about to drop the column `CPF` on the `usuario` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_usuario" (
    "id_usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "id_tipo_usuario" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cpf" TEXT,
    CONSTRAINT "usuario_id_tipo_usuario_fkey" FOREIGN KEY ("id_tipo_usuario") REFERENCES "tipo_usuario" ("id_tipo_usuario") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_usuario" ("ativo", "criado_em", "email", "id_tipo_usuario", "id_usuario", "nome", "senha_hash") SELECT "ativo", "criado_em", "email", "id_tipo_usuario", "id_usuario", "nome", "senha_hash" FROM "usuario";
DROP TABLE "usuario";
ALTER TABLE "new_usuario" RENAME TO "usuario";
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
